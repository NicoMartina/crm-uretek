package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.exceptions.InsuffcientMaterialException;
import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.*;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.MaterialUsageRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import com.sun.source.doctree.ThrowsTree;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobService {


    private JobRepository jobRepository;
    private InventoryRepository inventoryRepository;
    private VisitRepository visitRepository;
    private MaterialUsageRepository materialUsageRepository;

    public JobService(JobRepository jobRepository, InventoryRepository inventoryRepository, VisitRepository visitRepository, MaterialUsageRepository materialUsageRepository) {
        this.jobRepository = jobRepository;
        this.inventoryRepository = inventoryRepository;
        this.visitRepository = visitRepository;
        this.materialUsageRepository = materialUsageRepository;
    }

    public List<Job> findAllByOrderByIdDesc(){
        return jobRepository.findAllByOrderByIdDesc();
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
        System.out.println(">>> Updating job " + id + " to status: " + statusName);
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        JobStatus newStatus = JobStatus.valueOf(statusName.toUpperCase());
        System.out.println(">>> New status enum: " + newStatus);
        job.setJobStatus(newStatus);
        return jobRepository.save(job);
    }

    @Transactional
    public Job update(Long id, Job details){
        return jobRepository.findById(id)
                .map(job -> {
                    job.setObservations(details.getObservations());
                    job.setEstimateMaterialKg(details.getEstimateMaterialKg());
                    return jobRepository.save(job);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }
}
