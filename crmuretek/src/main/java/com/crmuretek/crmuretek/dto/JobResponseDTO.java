package com.crmuretek.crmuretek.dto;

import com.crmuretek.crmuretek.models.JobStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
public class JobResponseDTO {

    // Consulta identity
    private Long consultaId;

    // Customer identity. To whom this visit belongs to
    private Long customerId;

    // Job
    private Long jobId;
    private List<MaterialUsageDTO> materialUsages;
    private LocalDate workDate;
    private Double estimateMaterialKg;
    private String quoteNumber;
    private String observations;
    private JobStatus jobStatus;

}
