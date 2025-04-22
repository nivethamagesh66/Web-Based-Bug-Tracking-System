package com.bughound.repository;

import com.bughound.model.BugAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BugAttachmentRepository extends JpaRepository<BugAttachment, Long> {
    List<BugAttachment> findByBug_BugId(Long bugId);
}
