package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.models.Job;
import com.crmuretek.crmuretek.repositories.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    private Double calculatePendingBalance(Job job){
        // Defensive coding: Check if values are null to avoid "NullPointerException"
        Double total = (job.getTotalAmount() != null) ? job.getTotalAmount() : 0.0;
        Double paid = (job.getDownPaymentAmount() != null) ? job.getDownPaymentAmount() : 0.0;

        return total - paid;
    }

    //LAMBDAS/STREAM VERSION:
    public Double calculateTotalCompanyOutstandingBalance(){
        return jobRepository.findAll().stream()
                .mapToDouble(this::calculatePendingBalance)
                .sum();
    }
}
