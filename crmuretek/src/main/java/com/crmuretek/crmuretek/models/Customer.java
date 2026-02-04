package com.crmuretek.crmuretek.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.cglib.core.Local;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.List;


@Entity
@Table(name = "customers")
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("customer-jobs")
    private List<Job> jobs;


    @Column(nullable = false)
    @NotBlank(message = "El nombre es obligatorio")
    private String name;
    @NotBlank(message = "El email es obligatorio")
    private String email;
    @NotBlank(message = "La direccion es obligatorio")
    private String address;
    private String source; //how they found us
    @NotBlank(message = "El numero de telefono es obligatorio")
    private String phoneNumber;
    private String problemDescription;
    private String contactChannel;
    private LocalDate contactDate;
    private Boolean requestVisit;
    private LocalDate visitDate;

    @PrePersist
    protected void onCreate(){
        if(this.contactDate == null){
            this.contactDate = LocalDate.now();
        }
    }

}
