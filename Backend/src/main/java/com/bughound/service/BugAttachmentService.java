package com.bughound.service;

import com.bughound.model.BugAttachment;
import com.bughound.repository.BugAttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BugAttachmentService {

    @Autowired
    private BugAttachmentRepository repository;

    public BugAttachment save(BugAttachment file) {
        return repository.save(file);
    }

    public List<BugAttachment> getAll() {
        return repository.findAll();
    }
}