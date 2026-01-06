package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "material_usage")
@Data
public class MaterialUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "job_id")
    private Job job;

    private Double ISOQuantity; // ISO
    private Double ResinaQuantity; // RESINA
    private String unitOfMeasure;  // KILO
}
