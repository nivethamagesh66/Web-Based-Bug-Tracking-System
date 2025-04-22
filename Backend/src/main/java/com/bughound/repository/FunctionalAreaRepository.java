package com.bughound.repository;

import com.bughound.model.FunctionalArea;
import com.bughound.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FunctionalAreaRepository extends JpaRepository<FunctionalArea, Long> {
    List<FunctionalArea> findByProgram(Program program);
}