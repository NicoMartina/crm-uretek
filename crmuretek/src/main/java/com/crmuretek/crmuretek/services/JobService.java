package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.exceptions.InsuffcientMaterialException;
import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.Inventory;
import com.crmuretek.crmuretek.models.Job;
import com.crmuretek.crmuretek.models.JobStatus;
import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.client.ResourceAccessException;

import java.awt.*;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private VisitRepository visitRepository;

    public void syncFinancials(Job job){
        // 1. Calculate Total: Kg * Price
        double kg = (job.getEstimateMaterialKg() != null) ? job.getEstimateMaterialKg() : 0.0;
        double price = (job.getPricePerKilo() != null) ? job.getPricePerKilo() : 0.0;
        job.setTotalAmount(price * kg);

        // 2. Calculate Balance  (saldo)  Total - Anticipo
        Double total = (job.getTotalAmount() != null) ? job.getTotalAmount() : 0.0;
        Double paid = (job.getDownPaymentAmount() != null) ? job.getDownPaymentAmount() : 0.0;

        job.setBalanceAmount(total - paid);
    }

    // We use this in the Controller  with POST  and PUT
    @Transactional
    public Job createJobFromVisit(Long visitId, Job  jobDetails){
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Visit Not Found"));

        jobDetails.setVisit(visit);
        jobDetails.setCustomer(visit.getCustomer());
        jobDetails.setJobStatus(JobStatus.QUOTED);

        return jobRepository.save(jobDetails);
    }

    @Transactional
    public Job updateJobStatus(Long id, String statusName){
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        JobStatus newStatus = JobStatus.valueOf(statusName.toUpperCase());

        if (newStatus ==  JobStatus.IN_PROGRESS && job.getJobStatus() != JobStatus.IN_PROGRESS) {
            Inventory stock = inventoryRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Inventory not found"));
            double requiredIso = job.getEstimateMaterialKg() * 0.63;
            double requiredResina = job.getEstimateMaterialKg() * 0.37;

            if (stock.getIso_stock() < requiredIso || stock.getResina_stock() < requiredResina){
                throw new InsuffcientMaterialException("Insufficient stock to start the job.");
            }

            stock.setIso_stock(stock.getIso_stock() - requiredIso);
            stock.setResina_stock(stock.getResina_stock() - requiredResina);
            stock.setLastUpdated(java.time.LocalDateTime.now());
        }
        job.setJobStatus(newStatus);
        return jobRepository.save(job);
    }

    //LAMBDAS/STREAM VERSION:
    public Double calculateTotalCompanyOutstandingBalance(){
        return jobRepository.findAll().stream()
                .map(job -> job.getBalanceAmount() != null ? job.getBalanceAmount() : 0.0)
                .reduce(0.0, Double::sum);
    }
}
