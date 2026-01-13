package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;


@Entity
@Table(name = "customers")
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    @Column(nullable = false)
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private String issueDescription;
    private LocalDate contactDate;
    private boolean requestVisit;

}
