package com.crmuretek.crmuretek.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "leads")
@Data
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(columnDefinition = "TEXT")
    private String problemDescription;
    private String contactChannel;
    private LocalDate contactDate;
    private String source;
    private Boolean requestVisit;
    private LocalDate visitDate;

    @PrePersist
    protected void onCreate(){
        if(this.contactDate == null){
            this.contactDate = LocalDate.now();
        }
    }
}
