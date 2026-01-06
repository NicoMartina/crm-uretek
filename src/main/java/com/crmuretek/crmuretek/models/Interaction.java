package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "interactions")
@Data
public class Interaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private LocalDateTime interactionDate;

    @Column(columnDefinition = "TEXT") //Allows for long notes
    private String notes;

    private String type; // e.g., "Phone Call", "Email", "Visit"

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
