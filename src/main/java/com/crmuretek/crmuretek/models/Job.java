package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "jobs")
@Data
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private String acceptedBudgetNumber; // numero de presupesto aceptado
    private Double totalBudgetAmount;    // monto del presupuesto aceptado

    // Down payment (anticipo)
    private Double downPaymentAmount;    // monto del anticipo (generalmente 50%)
    private String downPaymentMethod;   // metodo de pago del anticipo
    private LocalDate downPaymentAmountDate; // fecha de pago del anticipo

    private LocalDate workDate;   // fecha del trabajo
    private String jobStatus;     //status del trabajo

    //Final Balance (Saldo)
    private Double balanceAmount;  // monto del saldo
    private LocalDate balancePaymentDate;  // fecha de pago del saldo
    private String balancePaymentMethod;   // metodo de pago del saldo

    private String completionFormUrl; // formulario de fin de obra

    @Column(columnDefinition = "TEXT")
    private String observations;
}
