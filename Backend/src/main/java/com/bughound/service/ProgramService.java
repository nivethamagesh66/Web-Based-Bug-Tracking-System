package com.bughound.service;

import com.bughound.model.Program;
import com.bughound.repository.ProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgramService {

    @Autowired
    private ProgramRepository programRepository;

    public Program save(Program program) {
        return programRepository.save(program);
    }

    public List<Program> getAll() {
        return programRepository.findAll();
    }

    public Optional<Program> getById(Long id) {
        return programRepository.findById(id);
    }

    public void delete(Long id) {
        programRepository.deleteById(id);
    }
}