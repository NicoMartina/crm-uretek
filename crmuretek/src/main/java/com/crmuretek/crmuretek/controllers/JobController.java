    package com.crmuretek.crmuretek.controllers;

    import com.crmuretek.crmuretek.models.Customer;
    import com.crmuretek.crmuretek.models.Job;
    import com.crmuretek.crmuretek.models.JobStatus;
    import com.crmuretek.crmuretek.repositories.JobRepository;
    import com.crmuretek.crmuretek.services.InventoryService;
    import com.crmuretek.crmuretek.services.JobService;
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

        public JobController(JobRepository jobRepository, InventoryService inventoryService, JobService jobService){
            this.jobRepository = jobRepository;
            this.inventoryService = inventoryService;
            this.jobService = jobService;
        }

        @PostMapping
        public ResponseEntity<Job> createJob(@Valid @RequestBody Job job) {
            // Basic validation: Ensure we have a customer linked
            if (job.getCustomer() == null || job.getCustomer().getId() <= 0){
                return ResponseEntity.badRequest().build();
            }
            job.setJobStatus(JobStatus.QUOTED);

            return ResponseEntity.ok(jobService.saveJob(job));
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
        public ResponseEntity<Job> updateJobStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body){
            // 1.Find job in database
            return jobRepository.findById(id).map(job -> {
                try {
                    // 2. Convert the String from React (e.g., "IN_PROGRESS") to Java Enum
                    // We strip quotes just in case the body comes in as "IN_PROGRESS"
                    String cleanStatus =  body.get("status").toUpperCase();
                    job.setJobStatus(JobStatus.valueOf(cleanStatus));

                    if ("COMPLETED".equals(cleanStatus) && job.getJobStatus() != JobStatus.COMPLETED) {
                        inventoryService.consumeMaterial(job.getEstimateMaterialKg());
                    }
                    // 3. Save the updated job
                    jobRepository.save(job);
                    return ResponseEntity.ok(job);
                } catch(IllegalArgumentException e){
                    return ResponseEntity.badRequest().<Job>build();
                }
            }).orElse(ResponseEntity.notFound().build());
        }











    }
