package com.crmuretek.crmuretek.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {

    // Inventory Data
    private double isoStock;
    private double resinaStock;
    private double possibleMix;


    // Financial Data
    private double totalQuoted;
    private double totalActive;
    private double metarialNeededTotal;
}
