package com.crmuretek.crmuretek.dto;

import com.crmuretek.crmuretek.models.VisitStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class VisitResponseDTO {

    // Consulta identity
    private Long consultaId;

    // Customer identity. To whom this visit belongs to
    private Long customerId;

    // Visit
    private Long visitId;
    private LocalDate visitDate;
    private boolean hasPaidVisitFee;
    private Double visitFeeAmount;
    private String paymentMethod;
    private String invoiceNumber;
    private VisitStatus status = VisitStatus.SOLICITADA;
    private String observations;

}
