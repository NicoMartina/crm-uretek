    package com.crmuretek.crmuretek.controllers;

    import com.crmuretek.crmuretek.models.Customer;
    import com.crmuretek.crmuretek.models.Job;
    import com.crmuretek.crmuretek.models.JobStatus;
    import com.crmuretek.crmuretek.repositories.JobRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/jobs")
    // This part is VITAL - it tells Java to let your React app (5173) in
    @CrossOrigin(origins = "*")
    public class JobController {

        @Autowired
        private final JobRepository jobRepository;

        public JobController(JobRepository jobRepository){
            this.jobRepository = jobRepository;
        }

        @GetMapping
        public List<Job> getAllJobs(){
            return jobRepository.findAll();
        }

        @PostMapping
        public ResponseEntity<Job> createJob(@RequestBody Job job) {
            // Basic validation: Ensure we have a customer linked
            if (job.getCustomer() == null || job.getCustomer().getId() <= 0){
                return ResponseEntity.badRequest().build();
            }
            job.setJobStatus(JobStatus.QUOTED);

            Job savedJob =jobRepository.save(job);
            return ResponseEntity.ok(savedJob);
        }

        @DeleteMapping("/{id}")
        public void deleteJob(@PathVariable Long id){
            jobRepository.deleteById(id);
        }

        @GetMapping("/stats/material-total")
        public ResponseEntity<Double> getTotalMaterial(){
            Double total = jobRepository.sumTotalMaterialForPendingJobs();
            return ResponseEntity.ok(total != null ? total : 0.0);
        }







    }
