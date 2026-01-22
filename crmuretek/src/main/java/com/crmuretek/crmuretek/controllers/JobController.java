package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.models.Job;
import com.crmuretek.crmuretek.repositories.JobRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
// This part is VITAL - it tells Java to let your React app (5173) in
@CrossOrigin(origins = "https://localhost:5174")
public class JobController {

    private final JobRepository jobRepository;

    public JobController(JobRepository jobRepository){
        this.jobRepository = jobRepository;
    }

    @GetMapping
    public List<Job> getAllJobs(){
        return jobRepository.findAll();
    }

}
