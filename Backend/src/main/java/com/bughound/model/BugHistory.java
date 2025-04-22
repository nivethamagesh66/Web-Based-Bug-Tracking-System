package com.bughound.model;

// ✅ Lombok annotations
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// ✅ JPA annotations
import jakarta.persistence.*;

// ✅ Java standard (if needed)
import java.time.LocalDateTime;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bug_history")
public class BugHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;

    @ManyToOne
    @JoinColumn(name = "bug_id")
    private Bug bug;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @Column(name = "change_description", columnDefinition = "TEXT")
    private String changeDescription;

    @Column(name = "date_updated")
    private LocalDateTime dateUpdated;
}