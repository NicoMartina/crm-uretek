package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "budgets")
@Data
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String budgetNumber;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToOne
    @JoinColumn(name = "visit_id")
    private Visit visit;

    private boolean isSent;

    private boolean isReceived;

    private boolean isAccepted;

    private Double totalAmount;

    private String acceptanceFormUrl;

    @Column(columnDefinition = "TEXT")
    private String observations;


}
