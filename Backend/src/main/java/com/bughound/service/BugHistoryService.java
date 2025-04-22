package com.bughound.service;

import com.bughound.model.BugHistory;
import com.bughound.repository.BugHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BugHistoryService {

    @Autowired
    private BugHistoryRepository repository;

    public BugHistory save(BugHistory history) {
        return repository.save(history);
    }

    public List<BugHistory> getAll() {
        return repository.findAll();
    }

    public List<BugHistory> getByBugId(Long bugId) {
        return repository.findByBug_BugId(bugId);
    }
}
