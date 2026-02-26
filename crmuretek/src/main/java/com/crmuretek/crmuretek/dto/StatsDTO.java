package com.crmuretek.crmuretek.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsDTO {
    private Map<String, Long>  leadsPerMonth;
    private Map<String, Long> visitsPerMonth;
    private Map<String, Long>  jobsPerMonth;
    private Map<String, Long>  leadsBySource;
    private Map<String, Double>  revenuePerMonth;

}
