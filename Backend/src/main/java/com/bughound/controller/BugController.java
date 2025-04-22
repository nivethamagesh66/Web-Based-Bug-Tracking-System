package com.bughound.controller;

import com.bughound.model.Bug;
import com.bughound.service.BugService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/bugs")
@CrossOrigin(origins = "http://localhost:3000")
public class BugController {

    @Autowired
    private BugService bugService;

    // ✅ Used for reporting a new bug with optional file upload
    @PostMapping(value = "/report", consumes = {"multipart/form-data"})
    public ResponseEntity<?> reportBugWithAttachment(
            @RequestPart("bug") Bug bug,
            @RequestPart(value = "attachment", required = false) MultipartFile file
    ) {
        return ResponseEntity.ok(bugService.save(bug, file));
    }

    // ✅ Retrieve all bugs
    @GetMapping
    public ResponseEntity<List<Bug>> getAll() {
        return ResponseEntity.ok(bugService.getAll());
    }

    // ✅ Update a bug with audit history, editor ID passed via query param
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBug(
            @PathVariable Long id,
            @RequestBody Bug bug,
            @RequestParam Long userId
    ) { System.out.println("➡️ Received editor userId: " + userId);

        return bugService.getById(id).map(existing -> {
            bug.setBugId(id);
            return ResponseEntity.ok(bugService.save(bug, null, userId));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete a bug
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        bugService.delete(id);
        return ResponseEntity.ok().build();
    }
}
