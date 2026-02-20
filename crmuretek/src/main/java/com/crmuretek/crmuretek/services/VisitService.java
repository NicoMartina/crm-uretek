package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.Lead;
import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.models.VisitStatus;
import com.crmuretek.crmuretek.repositories.LeadRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VisitService {
    private VisitRepository visitRepository;
    private LeadRepository leadRepository;

    public VisitService(VisitRepository visitRepository, LeadRepository leadRepository) {
        this.visitRepository = visitRepository;
        this.leadRepository = leadRepository;
    }

    @Transactional
    public  Visit scheduleVisitFromLead(Long leadId, Visit visitDetails){
        //Find the lead first
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(()-> new ResourceNotFoundException("Lead Not Found."));

        // Automatically pull the customer from the Lead!
        visitDetails.setLead(lead);
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
