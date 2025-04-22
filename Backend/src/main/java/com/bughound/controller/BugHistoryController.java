package com.bughound.controller;

import com.bughound.model.BugHistory;
import com.bughound.service.BugHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history") // ✅ This matches the frontend axios GET call
@CrossOrigin(origins = "http://localhost:3000")
public class BugHistoryController {

    @Autowired
    private BugHistoryService historyService;

    @GetMapping
    public ResponseEntity<List<BugHistory>> getAllHistory() {
        return ResponseEntity.ok(historyService.getAll());
    }

    @GetMapping("/{bugId}")
    public ResponseEntity<List<BugHistory>> getHistoryByBugId(@PathVariable Long bugId) {
        return ResponseEntity.ok(historyService.getByBugId(bugId));
    }
}
