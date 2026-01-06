package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "customer_visits")
@Data
public class Visit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private LocalDate visitDate;

    private boolean isVisited;

    private boolean hasPaidVisitFee;

    private Double visitFeeAmount;

    private String paymentMethod;

    private String invoiceNumber;

    @Column(columnDefinition = "TEXT")
    private String observations;
}
