package com.crmuretek.crmuretek.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.List;


@Entity
@Table(name = "customers")
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    @JsonManagedReference("customer-jobs")
    private List<Job> jobs;


    @Column(nullable = false)
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private String issueDescription;
    private LocalDate contactDate;
    private Boolean requestVisit;

}
