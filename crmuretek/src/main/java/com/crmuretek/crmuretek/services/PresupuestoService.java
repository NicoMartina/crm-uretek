package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.dto.JobResponseDTO;
import com.crmuretek.crmuretek.dto.PresupuestoRequestDTO;
import com.crmuretek.crmuretek.dto.PresupuestoResponseDTO;
import com.crmuretek.crmuretek.dto.VisitResponseDTO;
import com.crmuretek.crmuretek.exceptions.InvalidInputException;
import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.*;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.PresupuestoRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PresupuestoService {

    private VisitRepository visitRepository;
    private PresupuestoRepository presupuestoRepository;
    private JobRepository jobRepository;

    public PresupuestoService(VisitRepository visitRepository, JobRepository jobRepository, PresupuestoRepository presupuestoRepository) {
        this.visitRepository = visitRepository;
        this.jobRepository = jobRepository;
        this.presupuestoRepository = presupuestoRepository;
    }

    public List<PresupuestoResponseDTO> getAll(){
        return presupuestoRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Transactional
    public PresupuestoResponseDTO create(PresupuestoRequestDTO request) {

        Presupuesto presupuesto = new Presupuesto();
        if (request.getVisitId() != null) {
            Visit visit = visitRepository.findById(request.getVisitId())
                    .orElseThrow(() -> new ResourceNotFoundException("Visit not found."));

            presupuesto.setVisit(visit);
        }

        presupuesto.setPresupuestoNumber(request.getPresupuestoNumber());
        presupuesto.setVisitDate(request.getVisitDate());
        presupuesto.setAmount(request.getAmount());
        presupuesto.setAcceptanceForm(request.getAcceptanceForm());
        presupuesto.setObservations(request.getObservations());

        Presupuesto savedPresupuesto = presupuestoRepository.save(presupuesto);
        return toResponseDTO(savedPresupuesto);
    }

    @Transactional
    public PresupuestoResponseDTO updateStatus(Long id, String field, boolean value){
        Presupuesto presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Presupuesto not found"));

        switch (field) {
            case "sent" -> presupuesto.setSent(value);
            case "received" -> presupuesto.setReceived(value);
            case "accepted" -> presupuesto.setAccepted(value);
            default -> throw new InvalidInputException("Invalid input: " + field);
        }

        if (field.equals("accepted") && value && presupuesto.getVisit() != null) {
            Job job = new Job();
            job.setConsulta(presupuesto.getVisit().getConsulta());
            job.setVisit(presupuesto.getVisit());
            job.setQuoteNumber(presupuesto.getPresupuestoNumber());
            job.setObservations(presupuesto.getObservations());
            job.setJobStatus(JobStatus.QUOTED);
            jobRepository.save(job);
        }

        Presupuesto savedPresupuesto = presupuestoRepository.save(presupuesto);
        return toResponseDTO(savedPresupuesto);
    }

    @Transactional
    public PresupuestoResponseDTO updateInfo(Long id, PresupuestoRequestDTO request) {
        Presupuesto presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Presupuesto not found" + id));


        presupuesto.setPresupuestoNumber(request.getPresupuestoNumber());
        presupuesto.setVisitDate(request.getVisitDate());
        presupuesto.setAmount(request.getAmount());
        presupuesto.setAcceptanceForm(request.getAcceptanceForm());
        presupuesto.setObservations(request.getObservations());

        Presupuesto savedPresupuesto = presupuestoRepository.save(presupuesto);
        return toResponseDTO(savedPresupuesto);
    }

    public void delete(Long id){
        presupuestoRepository.deleteById(id);
    }



    private PresupuestoResponseDTO toResponseDTO(Presupuesto presupuesto){
        PresupuestoResponseDTO response = new PresupuestoResponseDTO();

        if (presupuesto.getVisit()  != null){
            response.setPresupuestoId(presupuesto.getId());
            response.setVisitDate(presupuesto.getVisitDate());
            response.setSent(presupuesto.isSent());
            response.setReceived(presupuesto.isReceived());
            response.setAccepted(presupuesto.isAccepted());
            response.setAmount(presupuesto.getAmount());
            response.setAcceptanceForm(presupuesto.getAcceptanceForm());
            response.setObservations(presupuesto.getObservations());

            response.setPresupuestoNumber(presupuesto.getPresupuestoNumber());
            response.setVisitId(presupuesto.getVisit().getId());
            response.setCustomerId(presupuesto.getVisit().getConsulta().getCustomer().getId());
            response.setConsultaId(presupuesto.getVisit().getConsulta().getId());
            response.setCustomerName(presupuesto.getVisit().getConsulta().getCustomer().getName());
        }

        return response;
    }


}
