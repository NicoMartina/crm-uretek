package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.dto.DashboardSummaryDTO;
import com.crmuretek.crmuretek.dto.StatsDTO;
import com.crmuretek.crmuretek.models.Inventory;
import com.crmuretek.crmuretek.models.Lead;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.LeadRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class DashboardService {


    private JobRepository jobRepository;
    private InventoryRepository inventoryRepository;
    private LeadRepository leadRepository;
;
    public DashboardService(JobRepository jobRepository, InventoryRepository inventoryRepository, LeadRepository leadRepository) {
        this.jobRepository = jobRepository;
        this.inventoryRepository = inventoryRepository;
        this.leadRepository = leadRepository;
    }

    public DashboardSummaryDTO getDashboardSummary(){
        // 1. Safety check for Inventory (Prevents crash if table is empty)
        Inventory inventory =inventoryRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    Inventory mock = new Inventory();
                    mock.setIsoStock(0.0);
                    mock.setResinaStock(0.0);
                    return mock;
                });

        // 2. Fetch Job Totals (Handling NULLs from SQL)
        Double totalQuoted = jobRepository.sumQuotedAmount();
        Double totalActive = jobRepository.sumActiveAmount();
        Double materialNeeded = jobRepository.sumRequiredMaterial();

        // 3. Business Logic
        double isoStock = (inventory.getIsoStock() != null) ? inventory.getIsoStock() : 0.0;
        double resinaStock = (inventory.getResinaStock() != null) ? inventory.getResinaStock() : 0.0;

        double isoRatio = 0.63;
        double resinaRatio = 0.37;

        double mixFromIso = isoStock / isoRatio;
        double mixFromResina = resinaStock / resinaRatio;

        Double possibleMix = Math.min(mixFromIso, mixFromResina);

        // 4. Return the Cleaned DTO
        return new DashboardSummaryDTO(
                isoStock,
                resinaStock,
                possibleMix,
                totalQuoted != null ? totalQuoted : 0.0,
                totalActive != null ? totalActive : 0.0,
                materialNeeded != null ? materialNeeded : 0.0
        );
    }

    public StatsDTO getStats(){
        Map<String, Long> leadsPerMonth = new LinkedHashMap<>();
        Map<String, Long> leadsBySource = new LinkedHashMap<>();
        Map<String, Long> jobsPerMonth = new LinkedHashMap<>();
        Map<String, Double> revenuePerMonth = new LinkedHashMap<>();

        for (Object[] row : leadRepository.countLeadsPerMonth()) {
            leadsPerMonth.put((String) row[0], ((Number) row[1]).longValue());
        }

        for (Object[] row : leadRepository.countLeadsBySource()) {
            String source = row[0] != null ? row[0].toString() : "Sin Fuente";
            leadsBySource.put(source, ((Number) row[1]).longValue());
        }

        for (Object[] row : jobRepository.countJobsAndRevenuePerMonth()) {
            jobsPerMonth.put((String) row[0], ((Number) row[1]).longValue());
            revenuePerMonth.put((String) row[0], row[2] != null ? ((Number) row[2]).doubleValue() : 0.0);
        }

        return new StatsDTO(leadsPerMonth, jobsPerMonth, leadsBySource, revenuePerMonth);

    }

}
