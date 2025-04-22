package com.bughound.controller;

import com.bughound.model.FunctionalArea;
import com.bughound.service.FunctionalAreaService;
import com.bughound.service.ProgramService;
import com.bughound.model.Program;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/functional-areas")
public class FunctionalAreaController {

    @Autowired
    private FunctionalAreaService areaService;

    @Autowired
    private ProgramService programService;

    @GetMapping
    public List<FunctionalArea> getAll() {
        return areaService.getAll();
    }

    @GetMapping("/{programId}")
    public ResponseEntity<?> getByProgram(@PathVariable Long programId) {
        return programService.getById(programId)
                .map(program -> ResponseEntity.ok(areaService.getByProgram(program)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody FunctionalArea area) {
        return ResponseEntity.ok(areaService.save(area));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody FunctionalArea data) {
        return areaService.getById(id).map(a -> {
            a.setName(data.getName());
            return ResponseEntity.ok(areaService.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        areaService.delete(id);
        return ResponseEntity.ok().build();
    }
}