package com.bughound.controller;

import com.bughound.model.Bug;
import com.bughound.model.BugAttachment;
import com.bughound.model.User;
import com.bughound.repository.BugAttachmentRepository;
import com.bughound.repository.BugRepository;
import com.bughound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/attachments")
public class BugAttachmentController {

    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BugAttachmentRepository attachmentRepository;

    @Value("${upload.directory}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                        @RequestParam("bugId") Long bugId,
                                        @RequestParam("uploadedBy") Long userId) {

        try {
            // ✅ Load related entities
            Bug bug = bugRepository.findById(bugId)
                    .orElseThrow(() -> new RuntimeException("Bug not found"));

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // ✅ Save file to disk
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            String destination = uploadDir + File.separator + fileName;

            Path path = Paths.get(destination);
            Files.createDirectories(path.getParent()); // ensure folder exists
            Files.write(path, file.getBytes(), StandardOpenOption.CREATE);

            // ✅ Save metadata in DB
            BugAttachment attachment = new BugAttachment();
            attachment.setBug(bug);
            attachment.setUploadedBy(user);
            attachment.setUploadDate(LocalDateTime.now());
            attachment.setFilePath(destination);

            attachmentRepository.save(attachment);

            return ResponseEntity.ok("File uploaded successfully!");

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload file: " + e.getMessage());
        }
    }
}
