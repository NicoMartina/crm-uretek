package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double isoAmount;
    private Double resinaAmount;
    @Enumerated(EnumType.STRING)
    private MovementType type;
    private LocalDateTime movementDate;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = true)
    private Job job;



}
