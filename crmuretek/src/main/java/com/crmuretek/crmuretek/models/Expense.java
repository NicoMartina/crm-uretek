package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private Double amount;
    private LocalDate expenseDate;

    @Enumerated(EnumType.STRING)
    private ExpenseCategory category;
}
