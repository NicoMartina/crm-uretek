package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.dto.DashboardSummaryDTO;
import com.crmuretek.crmuretek.dto.StatsDTO;
import com.crmuretek.crmuretek.models.Inventory;
import com.crmuretek.crmuretek.models.Lead;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.LeadRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class DashboardService {
    private static final double ISO_RATIO = 0.63;
    private static final double RESINA_RATIO = 0.37;

    private JobRepository jobRepository;
    private InventoryRepository inventoryRepository;
    private VisitRepository visitRepository;
    private LeadRepository leadRepository;
;
    public DashboardService(JobRepository jobRepository, VisitRepository visitRepository, InventoryRepository inventoryRepository, LeadRepository leadRepository) {
        this.jobRepository = jobRepository;
        this.visitRepository = visitRepository;
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
        Double materialNeeded = 0.0;

        // 3. Business Logic
        double isoStock = (inventory.getIsoStock() != null) ? inventory.getIsoStock() : 0.0;
        double resinaStock = (inventory.getResinaStock() != null) ? inventory.getResinaStock() : 0.0;


        double mixFromIso = isoStock / ISO_RATIO;
        double mixFromResina = resinaStock / RESINA_RATIO;

        Double possibleMix = Math.min(mixFromIso, mixFromResina);

        // 4. Return the Cleaned DTO
        return new DashboardSummaryDTO(
                isoStock,
                resinaStock,
                possibleMix,
                materialNeeded != null ? materialNeeded : 0.0
        );
    }

    public StatsDTO getStats(){
        Map<String, Long> leadsPerMonth = new LinkedHashMap<>();
        Map<String, Map<String, Long>> leadsBySource = new LinkedHashMap<>();
        Map<String, Long> visitsPerMonth = new LinkedHashMap<>();
        Map<String, Long> jobsPerMonth = new LinkedHashMap<>();

        for (Object[] row : leadRepository.countLeadsPerMonth()) {
            String month = row[0] != null ? row[0].toString() : "Sin Fecha";
            Long leads = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            leadsPerMonth.put(month, leads);
        }

        for (Object[] row : leadRepository.countLeadsBySource()) {
            String month = row[0] != null ? row[0].toString() : "Sin Fecha";
            String source = row[1] != null ? row[1].toString() : "Sin fuente";
            Long count = ((Number) row[2]).longValue();
            leadsBySource.computeIfAbsent(month, k -> new LinkedHashMap<>()).put(source, count);
        }

        for (Object[] row : visitRepository.countVisitsPerMonth()) {
            String month = row[0] != null ? row[0].toString() : "Sin fecha";
            Long visits = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            visitsPerMonth.put(month, visits);
        }

        for (Object[] row : jobRepository.countJobsPerMonth()) {
            String month = row[0] != null ? row[0].toString() : "Sin fecha";
            Long jobs = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            jobsPerMonth.put(month, jobs);
        }

        return new StatsDTO(leadsPerMonth, leadsBySource, visitsPerMonth, jobsPerMonth);

    }

}
