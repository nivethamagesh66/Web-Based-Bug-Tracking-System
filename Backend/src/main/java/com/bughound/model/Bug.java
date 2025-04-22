package com.bughound.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bugs")
public class Bug {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bug_id")
    private Long bugId;

    private String title;
    private String description;

    @ManyToOne
    @JoinColumn(name = "program_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Program program;

    @ManyToOne
    @JoinColumn(name = "functional_area_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "program"})
    private FunctionalArea functionalArea;

    @ManyToOne
    @JoinColumn(name = "reported_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User reportedBy;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "report_type")
    private ReportType reportType;

    private String version;

    private String status;

    private String comments;

    private String canReproduce;

    private String suggestedFix;

    @Column(name = "treat_as_deferred")
    private boolean treatAsDeferred;

    @Column(name = "date_reported")
    private LocalDateTime dateReported;

    @Enumerated(EnumType.STRING)
    @Column(name = "resolution_status")
    private ResolutionStatus resolutionStatus;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "resolved_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User resolvedBy;

    @Column(name = "resolved_date")
    private LocalDateTime resolvedDate;
}
