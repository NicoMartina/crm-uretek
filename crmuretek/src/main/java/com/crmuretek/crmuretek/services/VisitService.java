package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.models.VisitStatus;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VisitService {
    private VisitRepository visitRepository;
    private ConsultaRepository consultaRepository;

    public VisitService(VisitRepository visitRepository, ConsultaRepository consultaRepository) {
        this.visitRepository = visitRepository;
        this.consultaRepository = consultaRepository;
    }

    public List<Visit> findAllByVisitDesc(){
        return visitRepository.findAllByOrderByVisitDateDesc();
    }

    @Transactional
    public  Visit scheduleVisitFromLead(Long leadId, Visit visitDetails){
        //Find the lead first
        Consulta consulta = consultaRepository.findById(leadId)
                .orElseThrow(()-> new ResourceNotFoundException("Lead Not Found."));

        // Automatically pull the customer from the Lead!
        visitDetails.setConsulta(consulta);
        visitDetails.setStatus(VisitStatus.SCHEDULED);

        return visitRepository.save(visitDetails);
    }

    @Transactional(readOnly = true)
    public List<Visit> getUnpaidVisits(){
        return visitRepository.findAll().stream()
                .filter(visit -> !visit.isHasPaidVisitFee())
                .toList();
    }

    @Transactional
    public Visit updateStatus(Long id, String status){
        Visit visit = visitRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Visit not found."));
        visit.setStatus(VisitStatus.valueOf(status.toUpperCase()));
        return visitRepository.save(visit);
    }
}
