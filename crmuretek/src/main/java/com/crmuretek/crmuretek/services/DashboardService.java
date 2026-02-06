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
        // 1. Fetch raw data from repositories
        // We find the first (and only) inventory  record
        Inventory inventory = inventoryRepository.findAll().get(0);

        Double totalQuoted = jobRepository.sumQuotedAmount();
        Double totalActive = jobRepository.sumActiveAmount();
        Double materialNeeded = jobRepository.sumRequiredMaterial();

        // 2. We do the math (aka the business logic)
        double isoRatio = 0.63;
        double resinaRatio = 0.37;

        double mixFromIso = inventory.getIso_stock() / isoRatio;
        double mixFromResina = inventory.getResina_stock() / resinaRatio;


        // The possible mix is the limited  by whichever stock runs out first
        Double possibleMix = Math.min(mixFromIso, mixFromResina);

        // 3. PACK THE BOX (DTO)
        // We use the "AllArgsConstructor" here to fill it quick.
        return new DashboardSummaryDTO(
                (Double) inventory.getIso_stock(),
                inventory.getResina_stock(),
                possibleMix,
                totalQuoted != null ?  totalQuoted : 0.0,
                totalActive != null ? totalActive : 0.0,
                materialNeeded != null ? materialNeeded : 0.0
        );

    }
}
