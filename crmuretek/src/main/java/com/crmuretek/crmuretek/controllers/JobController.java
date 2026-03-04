    package com.crmuretek.crmuretek.controllers;


    import com.crmuretek.crmuretek.models.Job;
    import com.crmuretek.crmuretek.models.JobStatus;
    import com.crmuretek.crmuretek.repositories.JobRepository;
    import com.crmuretek.crmuretek.services.JobService;
    import com.crmuretek.crmuretek.services.LeadService;
    import jakarta.validation.Valid;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/jobs")
    public class JobController {


        private final JobRepository jobRepository;
        private final JobService jobService;
        private final LeadService leadService;

        public JobController(JobRepository jobRepository, JobService jobService, LeadService leadService){
            this.jobRepository = jobRepository;
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
            return jobService.findAllByOrderByIdDesc();
        }

        @PutMapping("/{id}")
        public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody Job details) {
            return ResponseEntity.ok(jobService.update(id, details));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteJob(@PathVariable Long id){
            jobRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }

        @PatchMapping("{id}/status")
        public ResponseEntity<?> updateJobStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body){
            String statusValue =  body.get("status");
            if (statusValue == null) return ResponseEntity.badRequest().build();
            Job updated = jobService.updateJobStatus(id, statusValue);
            return ResponseEntity.ok(updated);
        }
    }
