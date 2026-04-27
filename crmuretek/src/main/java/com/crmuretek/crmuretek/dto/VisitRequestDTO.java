package com.crmuretek.crmuretek.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class VisitRequestDTO {
    // the consult that requested the visit
    private Long consultaId;

    // Visit fields
    private LocalDate visitDate;
    private String observations;
}
