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

    @Column(nullable = false)
    @NotBlank(message = "El nombre es obligatorio")
    private String name;
    @NotBlank(message = "El email es obligatorio")
    private String email;
    @NotBlank(message = "La direccion es obligatorio")
    private String address;
    @NotBlank(message = "El numero de telefono es obligatorio")
    private String phoneNumber;

    @Column(columnDefinition = "TEXT")
    private String problemDescription;
    @Enumerated(EnumType.STRING)
    private LeadContactEnum contactChannel;
    private LocalDate contactDate;
    @Enumerated(EnumType.STRING)
    private SourceEnum source;
    private Boolean visitRequested;
    private LocalDate visitDate;

    @PrePersist
    protected void onCreate(){
        if(this.contactDate == null){
            this.contactDate = LocalDate.now();
        }
    }
}
