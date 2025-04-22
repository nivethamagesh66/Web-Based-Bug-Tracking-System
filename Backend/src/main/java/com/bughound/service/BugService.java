package com.bughound.service;

import com.bughound.model.Bug;
import com.bughound.model.BugAttachment;
import com.bughound.model.BugHistory;
import com.bughound.model.User;
import com.bughound.repository.BugAttachmentRepository;
import com.bughound.repository.BugHistoryRepository;
import com.bughound.repository.BugRepository;
import com.bughound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BugService {

    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BugAttachmentRepository attachmentRepository;

    @Autowired
    private BugHistoryRepository bugHistoryRepository;

    @Value("${upload.directory}")
    private String uploadDir;

    public Bug save(Bug bug, MultipartFile file) {
        Long editorId = bug.getReportedBy() != null ? bug.getReportedBy().getId() : null;
        return save(bug, file, editorId);
    }

    @Transactional
    public Bug save(Bug bug, MultipartFile file, Long editorId) {
        boolean isNew = (bug.getBugId() == null);
        Bug oldBug = isNew ? null : bugRepository.findById(bug.getBugId()).orElse(null);

        if (!isNew && oldBug != null) {
            logBugChanges(oldBug, bug, editorId);
        }

        attachUserIfPresent(bug);

        if (bug.getStatus() == null || bug.getStatus().trim().isEmpty()) {
            bug.setStatus("OPEN");
        } else {
            bug.setStatus(bug.getStatus().toUpperCase());
        }

        bug.setDateReported(LocalDateTime.now());
        Bug savedBug = bugRepository.save(bug);

        if (file != null && !file.isEmpty()) {
            handleFileUpload(file, savedBug);
        }

        return savedBug;
    }

    private void handleFileUpload(MultipartFile file, Bug savedBug) {
        try {
            File dir = new File(uploadDir);
            if (!dir.exists() && !dir.mkdirs()) {
                throw new RuntimeException("Failed to create upload directory");
            }

            String safeFileName = file.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
            String filePath = new File(dir, safeFileName).getAbsolutePath();
            file.transferTo(new File(filePath));

            BugAttachment attachment = new BugAttachment();
            attachment.setBug(savedBug);
            attachment.setUploadedBy(savedBug.getReportedBy());
            attachment.setUploadDate(LocalDateTime.now());
            attachment.setFilePath(filePath);

            attachmentRepository.save(attachment);
        } catch (IOException e) {
            throw new RuntimeException("File saving failed: " + e.getMessage(), e);
        }
    }

    private void logBugChanges(Bug oldBug, Bug newBug, Long editorId) {
        StringBuilder changeLog = new StringBuilder();

        compare(changeLog, "Title", oldBug.getTitle(), newBug.getTitle());
        compare(changeLog, "Description", oldBug.getDescription(), newBug.getDescription());
        compare(changeLog, "Status", oldBug.getStatus(), newBug.getStatus());
        compare(changeLog, "Priority", oldBug.getPriority(), newBug.getPriority());
        compare(changeLog, "Severity", oldBug.getSeverity(), newBug.getSeverity());
        compare(changeLog, "Resolution", oldBug.getResolutionStatus(), newBug.getResolutionStatus());
        compare(changeLog, "Report Type", oldBug.getReportType(), newBug.getReportType());
        compare(changeLog, "Version", oldBug.getVersion(), newBug.getVersion());
        compare(changeLog, "Can Reproduce", oldBug.getCanReproduce(), newBug.getCanReproduce());
        compare(changeLog, "Suggested Fix", oldBug.getSuggestedFix(), newBug.getSuggestedFix());
        compare(changeLog, "Treat as Deferred", oldBug.isTreatAsDeferred(), newBug.isTreatAsDeferred());
        compare(changeLog, "Comments", trimOrNull(oldBug.getComments()), trimOrNull(newBug.getComments()));

        Long oldAssignedToId = oldBug.getAssignedTo() != null ? oldBug.getAssignedTo().getId() : null;
        Long newAssignedToId = newBug.getAssignedTo() != null ? newBug.getAssignedTo().getId() : null;
        if (!equals(oldAssignedToId, newAssignedToId)) {
            String oldName = oldBug.getAssignedTo() != null ? oldBug.getAssignedTo().getName() : "—";
            String newName = newAssignedToId != null
                    ? userRepository.findById(newAssignedToId).map(User::getName).orElse("—")
                    : "—";
            changeLog.append("Assigned To: ").append(oldName).append(" → ").append(newName).append("\n");
        }

        Long oldResolvedById = oldBug.getResolvedBy() != null ? oldBug.getResolvedBy().getId() : null;
        Long newResolvedById = newBug.getResolvedBy() != null ? newBug.getResolvedBy().getId() : null;
        if (!equals(oldResolvedById, newResolvedById)) {
            String oldName = oldBug.getResolvedBy() != null ? oldBug.getResolvedBy().getName() : "—";
            String newName = newResolvedById != null
                    ? userRepository.findById(newResolvedById).map(User::getName).orElse("—")
                    : "—";
            changeLog.append("Resolved By: ").append(oldName).append(" → ").append(newName).append("\n");
        }

        System.out.println("➡️ Change Log:\n" + changeLog);

        if (changeLog.length() > 0) {
            BugHistory history = new BugHistory();
            history.setBug(oldBug);
            history.setUpdatedBy(editorId != null ? userRepository.findById(editorId).orElse(null) : null);
            history.setDateUpdated(LocalDateTime.now());
            history.setChangeDescription(changeLog.toString().trim());

            bugHistoryRepository.save(history);
            System.out.println("✅ Bug history saved.");
        }
    }

    private void compare(StringBuilder log, String field, Object oldVal, Object newVal) {
        if (!equals(oldVal, newVal)) {
            log.append(field).append(": ")
                    .append(oldVal != null ? oldVal : "—")
                    .append(" → ")
                    .append(newVal != null ? newVal : "—")
                    .append("\n");
        }
    }

    private String trimOrNull(String value) {
        return value == null ? null : value.trim();
    }

    private boolean equals(Object a, Object b) {
        return a == null ? b == null : a.equals(b);
    }

    private void attachUserIfPresent(Bug bug) {
        if (bug.getAssignedTo() != null && bug.getAssignedTo().getId() != null) {
            bug.setAssignedTo(userRepository.findById(bug.getAssignedTo().getId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found")));
        }
        if (bug.getResolvedBy() != null && bug.getResolvedBy().getId() != null) {
            bug.setResolvedBy(userRepository.findById(bug.getResolvedBy().getId())
                    .orElseThrow(() -> new RuntimeException("Resolved user not found")));
        }
        if (bug.getReportedBy() != null && bug.getReportedBy().getId() != null) {
            bug.setReportedBy(userRepository.findById(bug.getReportedBy().getId())
                    .orElseThrow(() -> new RuntimeException("Reporter not found")));
        }
    }

    public List<Bug> getAll() {
        return bugRepository.findAll();
    }

    public Optional<Bug> getById(Long id) {
        return bugRepository.findById(id);
    }

    public void delete(Long id) {
        bugRepository.deleteById(id);
    }
}
