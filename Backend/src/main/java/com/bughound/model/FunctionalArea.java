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
@Table(name = "functional_areas")
public class FunctionalArea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "area_id")
    private Long areaId;

    private String name;

    @ManyToOne
    @JoinColumn(name = "program_id")
    private Program program;
}
