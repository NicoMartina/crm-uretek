package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;

@Entity
@Table(name = "presupuesto")
@Data
@NoArgsConstructor

public class Presupuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private String presupuestoNumber;

    private LocalDate visitDate;

    private boolean sent;

    private boolean received;

    private boolean accepted;

    private Double amount;

    private String acceptanceForm;

    private String observations;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "visit_id")
    private Visit visit;





}
