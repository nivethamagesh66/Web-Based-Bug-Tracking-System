package com.bughound.controller;

import com.bughound.model.Program;
import com.bughound.service.ProgramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programs")
public class ProgramController {

    @Autowired
    private ProgramService programService;

    @GetMapping
    public List<Program> getAll() {
        return programService.getAll();
    }

    @PostMapping("/add")
    public ResponseEntity<Program> add(@RequestBody Program program) {
        return ResponseEntity.ok(programService.save(program));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Program> update(@PathVariable Long id, @RequestBody Program updated) {
        return programService.getById(id).map(p -> {
            p.setName(updated.getName());
            p.setVersion(updated.getVersion());
            p.setReleaseNum(updated.getReleaseNum());
            return ResponseEntity.ok(programService.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        programService.delete(id);
        return ResponseEntity.ok().build();
    }
}
