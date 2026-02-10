package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.models.Lead;
import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.models.VisitStatus;
import com.crmuretek.crmuretek.repositories.LeadRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .orElseThrow(()-> new RuntimeException("Lead Not Found."));

        // Automatically pull the customer from the Lead!
        visitDetails.setLead(lead);
        visitDetails.setCustomer(lead.getCustomer());
        visitDetails.setStatus(VisitStatus.VISITED);

        return visitRepository.save(visitDetails);
    }

    public List<Visit> getUnpaidVisits(){
        return visitRepository.findAll().stream()
                .filter(visit -> !visit.isHasPaidVisitFee())
                .collect(Collectors.toList());
    }
}
