package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.dto.VisitRequestDTO;
import com.crmuretek.crmuretek.dto.VisitResponseDTO;
import com.crmuretek.crmuretek.exceptions.InvalidInputException;
import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.models.VisitStatus;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VisitService {
    private VisitRepository visitRepository;
    private ConsultaRepository consultaRepository;
    private JobRepository jobRepository;


    public VisitService(VisitRepository visitRepository, ConsultaRepository consultaRepository, JobRepository jobRepository) {
        this.visitRepository = visitRepository;
        this.consultaRepository = consultaRepository;
        this.jobRepository = jobRepository;
    }

    public List<Visit> findAllByVisitDesc(){
        return visitRepository.findAllOrderedByStatusThenDate();
    }

    @Transactional
    public  VisitResponseDTO scheduleVisitFromLead(VisitRequestDTO request){
        if (request.getConsultaId() == null) {
            throw new InvalidInputException("consultaId is required to create a visit.");
        }

        //Find the lead first
        Consulta consulta = consultaRepository.findById(request.getConsultaId())
                .orElseThrow(()-> new ResourceNotFoundException("Lead Not Found."));

        // Automatically pull the customer from the Lead!
        Visit visit = new Visit();
        visit.setConsulta(consulta);
        visit.setStatus(VisitStatus.SCHEDULED);
        visit.setVisitDate(request.getVisitDate());
        visit.setObservations(request.getObservations());

        Visit savedVisit = visitRepository.save(visit);
        return toResponseDTO(savedVisit);
    }

    private VisitResponseDTO toResponseDTO(Visit visit){
        VisitResponseDTO response = new VisitResponseDTO();
        response.setConsultaId(visit.getConsulta().getId());
        response.setCustomerId(visit.getConsulta().getCustomer().getId());
        response.setVisitId(visit.getId());
        response.setVisitDate(visit.getVisitDate());
        response.setHasPaidVisitFee(visit.isHasPaidVisitFee());
        response.setVisitFeeAmount(visit.getVisitFeeAmount());
        response.setPaymentMethod(visit.getPaymentMethod());
        response.setInvoiceNumber(visit.getInvoiceNumber());
        response.setStatus(visit.getStatus());
        response.setObservations(visit.getObservations());

        return response;
    }

    @Transactional(readOnly = true)
    public List<Visit> getUnpaidVisits(){
        return visitRepository.findAll().stream()
                .filter(visit -> !visit.isHasPaidVisitFee())
                .toList();
    }

    @Transactional
    public List<VisitResponseDTO> findAllOrderedByStatusThenDate(){
        return  visitRepository.findAllOrderedByStatusThenDate().stream()
                .map(visit -> toResponseDTO(visit)).collect(Collectors.toList());
    }

    @Transactional
    public VisitResponseDTO updateStatus(Long id, String status){

        Visit visit = visitRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Visit not found."));
        try {
            visit.setStatus(VisitStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException(status + " isn't a valid status.");
        }
        Visit saved = visitRepository.save(visit);
        return toResponseDTO(saved);
    }

    @Transactional
    public VisitResponseDTO updateDate(Long id, LocalDate date){
        Visit visit = visitRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Visit not found."));
        visit.setVisitDate(date);
        Visit saved = visitRepository.save(visit);
        return toResponseDTO(saved);
    }


    @Transactional
    public VisitResponseDTO updateObservations(Long id, String observations){
        Visit visit = visitRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Visit not found."));
        visit.setObservations(observations);
        Visit saved = visitRepository.save(visit);
        return toResponseDTO(saved);
    }

    @Transactional
    public void delete(Long id){
        if (jobRepository.existsByVisitId(id)){
            throw new ResourceNotFoundException("cannot delete lead with existing jobs");
        }
        visitRepository.deleteById(id);
    }
}
