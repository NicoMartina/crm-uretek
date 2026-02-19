package com.crmuretek.crmuretek.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "material_usage")
@Data
public class MaterialUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id")
    @JsonBackReference("job-materials")
    private Job job;

    private Double isoQuantity;
    private Double resinQuantity;

    @Column(columnDefinition = "TEXT")
    private String notes;

    LocalDate usageDate;
}
