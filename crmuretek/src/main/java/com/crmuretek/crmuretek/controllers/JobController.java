    package com.crmuretek.crmuretek.controllers;


    import com.crmuretek.crmuretek.models.Job;
    import com.crmuretek.crmuretek.models.JobStatus;
    import com.crmuretek.crmuretek.models.Lead;
    import com.crmuretek.crmuretek.repositories.JobRepository;
    import com.crmuretek.crmuretek.services.InventoryService;
    import com.crmuretek.crmuretek.services.JobService;
    import com.crmuretek.crmuretek.services.LeadService;
    import jakarta.validation.Valid;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/jobs")
    public class JobController {

        @Autowired
        private final JobRepository jobRepository;
        private final InventoryService inventoryService;
        private final JobService jobService;
        private final LeadService leadService;

        public JobController(JobRepository jobRepository, InventoryService inventoryService, JobService jobService, LeadService leadService){
            this.jobRepository = jobRepository;
            this.inventoryService = inventoryService;
            this.jobService = jobService;
            this.leadService = leadService;
        }

        @PostMapping
        public ResponseEntity<Job> createJob(@Valid @RequestBody Job job) {
            // 1. Basic validation: Ensure we have a customer linked
            if (job.getLead() == null || job.getLead().getId() <= 0){
                return ResponseEntity.badRequest().build();
            }
            // 2. Fetch the REAL customer from the DB
            return leadService.findById(job.getLead().getId())
                            .map(lead -> {
                                job.setLead(lead);
                                job.setJobStatus(JobStatus.QUOTED);

                                // 3. Save and Return
                                Job savedJob = jobService.saveJob(job);
                                return ResponseEntity.ok(savedJob);
                            })
                    .orElse(ResponseEntity.notFound().build());
        }

        @GetMapping
        public List<Job> getAllJobs(){
            return jobRepository.findAll();
        }

        @GetMapping("/stats/material-total")
        public ResponseEntity<Double> getTotalMaterial(){
            Double total = jobRepository.sumRequiredMaterial();
            return ResponseEntity.ok(total != null ? total : 0.0);
        }

        @PutMapping("/{id}")
        public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody Job details) {
            return jobRepository.findById(id).map(job -> {
                // 1. Update only the fields we are editing
                job.setObservations(details.getObservations());
                job.setEstimateMaterialKg(details.getEstimateMaterialKg());
                job.setPricePerKilo(details.getPricePerKilo());
                job.setDownPaymentAmount(details.getDownPaymentAmount());

                // 2. We call the service which handles everything
                return ResponseEntity.ok(jobService.saveJob(job));
            }).orElse(ResponseEntity.notFound().build());
        }

        @DeleteMapping("/{id}")
        public void deleteJob(@PathVariable Long id){
            jobRepository.deleteById(id);
        }



        @PatchMapping("{id}/status")
        public ResponseEntity<?> updateJobStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body){
            // 1.Find job in database
            return jobRepository.findById(id).map(job -> {
                try {
                    // 2. Convert the String from React (e.g., "IN_PROGRESS") to Java Enum
                    // We strip quotes just in case the body comes in as "IN_PROGRESS"
                    String statusValue =  body.get("status");
                    if (statusValue == null) {
                        return ResponseEntity.badRequest().build();
                    }

                    JobStatus previousStatus = job.getJobStatus();
                    JobStatus newStatus = JobStatus.valueOf(statusValue.toUpperCase());

                    // only consume material if status is COMPLETED
                    if (previousStatus != JobStatus.COMPLETED && newStatus == JobStatus.COMPLETED) {
                        inventoryService.consumeMaterial(job.getEstimateMaterialKg());
                    }

                    job.setJobStatus(newStatus);

                    // 3. Save the updated job
                    jobRepository.save(job);
                    return ResponseEntity.ok(job);

                } catch(IllegalArgumentException e){
                    return ResponseEntity.badRequest().build();
                }
            }).orElse(ResponseEntity.notFound().build());
        }











    }
