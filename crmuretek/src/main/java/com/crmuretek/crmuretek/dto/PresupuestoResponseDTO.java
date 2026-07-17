package com.crmuretek.crmuretek.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class PresupuestoResponseDTO {

    // Consulta identity
    private Long consultaId;

    // Customer identity. To whom this visit belongs to
    private Long customerId;
    private String customerName;

    //the visit. To whom the presupuesto belongs to
    private Long visitId;

    // presupuesto

    private  Long presupuestoId;
    private String presupuestoNumber;
    private LocalDate visitDate;
    private Double amount;
    private boolean sent;
    private boolean received;
    private boolean accepted;
    private String acceptanceForm;
    private String observations;
}
