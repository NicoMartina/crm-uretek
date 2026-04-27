package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.dto.JobRequestDTO;
import com.crmuretek.crmuretek.dto.JobResponseDTO;
import com.crmuretek.crmuretek.dto.MaterialUsageDTO;
import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.*;
import com.crmuretek.crmuretek.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {


    private JobRepository jobRepository;
    private VisitRepository visitRepository;
    private ConsultaRepository consultaRepository;

    public JobService(JobRepository jobRepository, VisitRepository visitRepository, ConsultaRepository consultaRepository) {
        this.jobRepository = jobRepository;
        this.visitRepository = visitRepository;
        this.consultaRepository = consultaRepository;
    }

    public List<JobResponseDTO> findAllByOrderByIdDesc(){
        return jobRepository.findAllByOrderByIdDesc().stream()
                .map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Transactional
    public Job saveJob(Job job){
        if (job.getVisit() != null  && job.getConsulta() == null) {
            job.setConsulta(job.getVisit().getConsulta());
        }
        return jobRepository.save(job);
    }

    // We use this in the Controller  with POST  and PUT
    @Transactional
    public JobResponseDTO createJobFromVisit(JobRequestDTO request){
        // find lead
        Consulta consulta = consultaRepository.findById(request.getConsultaId())
                .orElseThrow(() -> new ResourceNotFoundException("Lead Not Found."));

        Job job = new Job();
        if (request.getVisitId() != null){
            Visit visit = visitRepository.findById(request.getVisitId())
                    .orElseThrow(()-> new ResourceNotFoundException("Visit Not Found"));

            job.setVisit(visit);
        }
        job.setConsulta(consulta);
        job.setEstimateMaterialKg(request.getEstimateMaterialKg());
        job.setJobStatus(JobStatus.QUOTED);
        job.setWorkDate(request.getWorkDate());
        job.setObservations(request.getObservations());

        Job savedJob = jobRepository.save(job);


        return toResponseDTO(savedJob);
    }



    @Transactional
    public JobResponseDTO updateJobStatus(Long id, String statusName){
        System.out.println(">>> Updating job " + id + " to status: " + statusName);
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        JobStatus newStatus = JobStatus.valueOf(statusName.toUpperCase());
        System.out.println(">>> New status enum: " + newStatus);
        job.setJobStatus(newStatus);
        Job savedJob = jobRepository.save(job);
        return toResponseDTO(job);
    }

    @Transactional
    public JobResponseDTO update(Long id, JobRequestDTO details){
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        Consulta consulta = consultaRepository.findById(details.getConsultaId())
                .orElseThrow(()-> new ResourceNotFoundException("No lead found with ID" + id));

        job.setConsulta(consulta);


        if (details.getVisitId() != null){
            Visit visit = visitRepository.findById(details.getVisitId())
                    .orElseThrow(()-> new ResourceNotFoundException("Visit Not Found"));
            job.setVisit(visit);
        }

        job.setObservations(details.getObservations());
        job.setWorkDate(details.getWorkDate());
        job.setEstimateMaterialKg(details.getEstimateMaterialKg());

        Job savedJob = jobRepository.save(job);
        return toResponseDTO(savedJob);

    }

    public void delete(Long id){
        jobRepository.deleteById(id);
    }

    private JobResponseDTO toResponseDTO(Job job){

        JobResponseDTO response = new JobResponseDTO();

        response.setConsultaId(job.getConsulta().getId());
        response.setCustomerId(job.getConsulta().getCustomer().getId());
        response.setJobId(job.getId());
        response.setWorkDate(job.getWorkDate());
        response.setEstimateMaterialKg(job.getEstimateMaterialKg());
        response.setMaterialUsages(job.getMaterialUsages() != null ? job.getMaterialUsages().stream().map(this::toMaterialUsageDTO).collect(Collectors.toList()) : List.of());
        response.setQuoteNumber(job.getQuoteNumber());
        response.setObservations(job.getObservations());
        response.setJobStatus(job.getJobStatus());

        return response;
    }

    private MaterialUsageDTO toMaterialUsageDTO(MaterialUsage m) {

        MaterialUsageDTO material = new MaterialUsageDTO();

        material.setUsageDate(m.getUsageDate());
        material.setIsoQuantity(m.getIsoQuantity());
        material.setResinQuantity(m.getResinQuantity());

        return material;
    }
}
