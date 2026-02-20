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
import com.sun.source.doctree.ThrowsTree;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JobService {


    private JobRepository jobRepository;
    private InventoryRepository inventoryRepository;
    private VisitRepository visitRepository;

    public JobService(JobRepository jobRepository, InventoryRepository inventoryRepository, VisitRepository visitRepository) {
        this.jobRepository = jobRepository;
        this.inventoryRepository = inventoryRepository;
        this.visitRepository = visitRepository;
    }

    public List<Job> findAll(){
        return jobRepository.findAll();
    }

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
    @Transactional
    public Job saveJob(Job job){
        if (job.getVisit() != null  && job.getLead() == null) {
            job.setLead(job.getVisit().getLead());
        }
        return jobRepository.save(job);
    }

    // We use this in the Controller  with POST  and PUT
    @Transactional
    public Job createJobFromVisit(Long visitId, Job  jobDetails){
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new ResourceNotFoundException("Visit Not Found"));

        jobDetails.setVisit(visit);
        jobDetails.setLead(visit.getLead());
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

            if (stock.getIsoStock() < requiredIso || stock.getResinaStock() < requiredResina){
                throw new InsuffcientMaterialException("Insufficient stock to start the job.");
            }

            stock.setIsoStock(stock.getIsoStock() - requiredIso);
            stock.setResinaStock(stock.getResinaStock() - requiredResina);
            stock.setLastUpdated(java.time.LocalDateTime.now());
        }
        job.setJobStatus(newStatus);
        return jobRepository.save(job);
    }

    @Transactional
    public Job update(Long id, Job details){
        return jobRepository.findById(id)
                .map(job -> {
                    job.setObservations(details.getObservations());
                    job.setEstimateMaterialKg(details.getEstimateMaterialKg());
                    job.setPricePerKilo(details.getPricePerKilo());
                    job.setDownPaymentAmount(details.getDownPaymentAmount());
                    return jobRepository.save(job);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    // TO BE REMOVED ON A FUTURE TICKET
    public Double calculateTotalCompanyOutstandingBalance(){
        return jobRepository.findAll().stream()
                .map(job -> job.getBalanceAmount() != null ? job.getBalanceAmount() : 0.0)
                .reduce(0.0, Double::sum);
    }
}
