package com.bughound.service;

import com.bughound.model.FunctionalArea;
import com.bughound.model.Program;
import com.bughound.repository.FunctionalAreaRepository;
import com.bughound.repository.ProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FunctionalAreaService {

    @Autowired
    private FunctionalAreaRepository functionalAreaRepository;

    @Autowired
    private ProgramRepository programRepository;

    public FunctionalArea save(FunctionalArea area) {
        // ✅ Fetch the persistent Program entity from DB
        Long programId = area.getProgram().getProgramId();
        Program persistentProgram = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        area.setProgram(persistentProgram);
        return functionalAreaRepository.save(area);
    }

    public List<FunctionalArea> getAll() {
        return functionalAreaRepository.findAll();
    }

    public Optional<FunctionalArea> getById(Long id) {
        return functionalAreaRepository.findById(id);
    }

    public void delete(Long id) {
        functionalAreaRepository.deleteById(id);
    }

    public List<FunctionalArea> getByProgram(Program program) {
        return functionalAreaRepository.findByProgram(program);
    }
}
