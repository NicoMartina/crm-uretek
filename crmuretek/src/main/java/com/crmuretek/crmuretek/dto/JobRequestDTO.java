package com.crmuretek.crmuretek.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class JobRequestDTO {
    // which consulta is asking for to do the job
    private Long consultaId;

    // if visit made, which visit is asking to do the job
    private Long visitId;

    private String observations;
    private LocalDate workDate;
    private Double estimateMaterialKg;
}
