package com.crmuretek.crmuretek.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class MaterialUsageDTO {

    private Double isoQuantity;
    private Double resinQuantity;

    LocalDate usageDate;
}
