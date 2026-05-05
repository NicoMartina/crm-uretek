package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.models.Job;
import com.crmuretek.crmuretek.models.MaterialConstants;
import com.crmuretek.crmuretek.models.MaterialUsage;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.MaterialUsageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class MaterialUsageService {


    private final JobRepository jobRepository;
    private final InventoryService inventoryService;
    private final MaterialUsageRepository materialUsageRepository;

    public MaterialUsageService(JobRepository jobRepository, InventoryService inventoryService, MaterialUsageRepository materialUsageRepository) {
        this.jobRepository = jobRepository;
        this.inventoryService = inventoryService;
        this.materialUsageRepository = materialUsageRepository;
    }

    @Transactional
    public void createMaterialUsage(Double totalKg, Long jobId){
        Job job = jobRepository.findById(jobId)
                .orElseThrow( () -> new RuntimeException("Job Not Found."));

        // 1. UPDATE INVENTORY + CREATE MOVEMENT
        inventoryService.useMaterial(totalKg, job);

        // 2. COMPUTE BREAKDOWN
        double iso = totalKg * MaterialConstants.ISO_RATIO;
        double resina = totalKg * MaterialConstants.RESINA_RATIO;

        // 3. Create MaterialUsage
        MaterialUsage usage = new MaterialUsage();
        usage.setJob(job);
        usage.setIsoQuantity(iso);
        usage.setResinQuantity(resina);
        usage.setUsageDate(LocalDate.now());

        // 4. SAVE
        materialUsageRepository.save(usage);

    }
}
