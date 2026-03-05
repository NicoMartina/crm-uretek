package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "leads_visits")
@Data
public class Visit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "lead_id")
    private Consulta consulta;

    private LocalDate visitDate;
    private boolean hasPaidVisitFee;
    private Double visitFeeAmount;
    private String paymentMethod;
    private String invoiceNumber;

    @Enumerated(EnumType.STRING)
    private VisitStatus status = VisitStatus.SCHEDULED;

    @Column(columnDefinition = "TEXT")
    private String observations;
}
