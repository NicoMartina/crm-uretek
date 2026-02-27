package com.crmuretek.crmuretek.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "leads")
@Data
@NoArgsConstructor
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;
    private String email;
    private String address;
    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String problemDescription;
    @Enumerated(EnumType.STRING)
    private LeadContactEnum contactChannel;
    private LocalDate contactDate;
    @Enumerated(EnumType.STRING)
    private SourceEnum source;

    @PrePersist
    protected void onCreate(){
        if(this.contactDate == null){
            this.contactDate = LocalDate.now();
        }
    }
}
