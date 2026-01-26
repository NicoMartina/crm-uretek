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
        public Job createJob(@RequestBody Job job) {
            // This will save the new job and return it back to React
            return jobRepository.save(job);
        }

        @DeleteMapping("/{id}")
        public void deleteJob(@PathVariable Long id){
            jobRepository.deleteById(id);
        }

        @PatchMapping("/{id}/status")
        public ResponseEntity<Job> updateStatus(@PathVariable Long id, @RequestBody String status){
            return jobRepository.findById(id)
                    .map(job -> {
                        String cleanStatus = status.replace("\"", "");
                        job.setJobStatus(JobStatus.valueOf(cleanStatus));
                        return ResponseEntity.ok(jobRepository.save(job));
                    })
                    .orElse(ResponseEntity.notFound().build());
        }
    }
