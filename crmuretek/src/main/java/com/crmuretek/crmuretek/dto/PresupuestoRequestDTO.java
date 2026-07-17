package com.crmuretek.crmuretek.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class PresupuestoRequestDTO {

    //the visit that belongs to the presupuesto
    private Long visitId;

    private String presupuestoNumber;

    private LocalDate visitDate;

    private Double amount;

    private String acceptanceForm;

    private String observations;
}
