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
@Table(name = "programs")
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_id")
    private Long programId;

    private String name;
    private String version;

    @Column(name = "release_num")
    private Integer releaseNum;
}