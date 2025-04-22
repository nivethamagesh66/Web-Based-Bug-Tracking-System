package com.bughound.repository;

import com.bughound.model.BugHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugHistoryRepository extends JpaRepository<BugHistory, Long> {

    List<BugHistory> findByBug_BugId(Long bugId); // ✅ Fetch history by bug ID
}
