    package com.crmuretek.crmuretek.controllers;


    import com.crmuretek.crmuretek.dto.JobRequestDTO;
    import com.crmuretek.crmuretek.dto.JobResponseDTO;
    import com.crmuretek.crmuretek.models.Job;
    import com.crmuretek.crmuretek.models.JobStatus;
    import com.crmuretek.crmuretek.repositories.JobRepository;
    import com.crmuretek.crmuretek.services.JobService;
    import com.crmuretek.crmuretek.services.ConsultaService;
    import jakarta.validation.Valid;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/api/jobs")
    public class JobController {

        private final JobService jobService;


        public JobController(JobService jobService){
            this.jobService = jobService;
        }

        @PostMapping
        public ResponseEntity<JobResponseDTO> createJob(@Valid @RequestBody JobRequestDTO request) {
            // 1. Basic validation: Ensure we have a customer linked
            if (request.getConsultaId() == null || request.getConsultaId() <= 0){
                return ResponseEntity.badRequest().build();
            }
            JobResponseDTO job= jobService.createJobFromVisit(request);
            return ResponseEntity.ok(job);
        }

        @GetMapping
        public List<JobResponseDTO> getAllJobs(){
            return jobService.findAllByOrderByIdDesc();
        }   

        @PutMapping("/{id}")
        public ResponseEntity<JobResponseDTO> updateJob(@PathVariable Long id, @RequestBody JobRequestDTO details) {
            JobResponseDTO job = jobService.update(id, details);
            return ResponseEntity.ok(job);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteJob(@PathVariable Long id){
            jobService.delete(id);
            return ResponseEntity.noContent().build();
        }

        @PatchMapping("{id}/status")
        public ResponseEntity<JobResponseDTO> updateJobStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body){
            String statusValue =  body.get("status");
            if (statusValue == null) return ResponseEntity.badRequest().build();
            JobResponseDTO updated = jobService.updateJobStatus(id, statusValue);
            return ResponseEntity.ok(updated);
        }
    }
