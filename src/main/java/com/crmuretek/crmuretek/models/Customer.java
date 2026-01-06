package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import lombok.Data;


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

}
