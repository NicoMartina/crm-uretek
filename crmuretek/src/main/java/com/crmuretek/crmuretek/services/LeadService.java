package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.models.Lead;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.LeadRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LeadService {
    private LeadRepository leadRepository;
    private JobRepository jobRepository;
    private VisitRepository visitRepository;

    public LeadService(LeadRepository leadRepository, JobRepository jobRepository, VisitRepository visitRepository) {
        this.leadRepository = leadRepository;
        this.jobRepository = jobRepository;
        this.visitRepository = visitRepository;
    }

    public List<Lead> findAll(){
        return leadRepository.findAll();
    }

    public Optional<Lead> findById(Long id){
        return leadRepository.findById(id);
    }

    public Lead create(Lead lead){
        return leadRepository.save(lead);
    }


    public Lead update(Long id, Lead details){
        return leadRepository.findById(id)
                .map(existing -> {
                    existing.setName(details.getName());
                    existing.setEmail(details.getEmail());
                    existing.setAddress(details.getAddress());
                    existing.setPhoneNumber(details.getPhoneNumber());
                    existing.setProblemDescription(details.getProblemDescription());
                    existing.setContactChannel(details.getContactChannel());
                    existing.setContactDate(details.getContactDate());
                    existing.setSource(details.getSource());

                    return existing;
                })
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
    }

    public void delete(Long id){
        if (jobRepository.existsByLeadId(id)){
            throw new RuntimeException("cannot delete lead with exisiting jobs");
        }

        if (visitRepository.existsByLeadId(id)){
            throw new RuntimeException("cannot delete lead with exisiting visits");
        }

        leadRepository.deleteById(id);
    }



}
