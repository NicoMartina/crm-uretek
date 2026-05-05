package com.crmuretek.crmuretek.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateMaterialUsageRequestDTO {

    private Double totalKg;
    private Long jobId;
}
