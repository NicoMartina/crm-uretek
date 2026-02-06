package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.Job;
import com.crmuretek.crmuretek.models.JobStatus;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.client.ResourceAccessException;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

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
    public Job saveJob(Job job){
        syncFinancials(job);
        return jobRepository.save(job);
    }

    public Job updateJobStatus(Long id, JobStatus newStatus){
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (newStatus ==  JobStatus.IN_PROGRESS){
            // Logic: Check inventory here before allowing the status change
            // This is pure backend specialization!
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
