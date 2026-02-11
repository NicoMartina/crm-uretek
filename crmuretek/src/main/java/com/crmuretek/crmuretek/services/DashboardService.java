package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.dto.DashboardSummaryDTO;
import com.crmuretek.crmuretek.models.Inventory;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public DashboardSummaryDTO getDashboardSummary(){
        // 1. Safety check for Inventory (Prevents crash if table is empty)
        Inventory inventory =inventoryRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    Inventory mock = new Inventory();
                    mock.setIso_stock(0.0);
                    mock.setResina_stock(0.0);
                    return mock;
                });

        // 2. Fetch Job Totals (Handling NULLs from SQL)
        Double totalQuoted = jobRepository.sumQuotedAmount();
        Double totalActive = jobRepository.sumActiveAmount();
        Double materialNeeded = jobRepository.sumRequiredMaterial();

        // 3. Business Logic
        double isoStock = (inventory.getIso_stock() != null) ? inventory.getIso_stock() : 0.0;
        double resinaStock = (inventory.getResina_stock() != null) ? inventory.getResina_stock() : 0.0;

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

}
