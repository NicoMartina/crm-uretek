package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "material_usage")
@Data
public class MaterialUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    private Double iSOQuantity;
    private Double resinQuantity;

    private String unitOfMeasure;

    @Column(columnDefinition = "TEXT")
    private String notes;

    LocalDate usageDate;
}
