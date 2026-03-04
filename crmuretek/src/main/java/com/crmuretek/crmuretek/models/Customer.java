package com.crmuretek.crmuretek.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "customers")
@Data
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "customer")
    @JsonIgnoreProperties("customer")
    private List<Consulta> consulta;

    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    @Enumerated(EnumType.STRING)
    private LeadContactEnum contactChannel;
    @Enumerated(EnumType.STRING)
    private SourceEnum source;
    private LocalDate contactDate;

    @PrePersist
    protected void onCreate(){
        if(this.contactDate == null){
            this.contactDate = LocalDate.now();
        }
    }



}
