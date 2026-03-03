package com.crmuretek.crmuretek.dto;

public record DashboardSummaryDTO(
        double isoStock,
        double resinaStock,
        double possibleMix,
        double materialNeededTotal
) { }