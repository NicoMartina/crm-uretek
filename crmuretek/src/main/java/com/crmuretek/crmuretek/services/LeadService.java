package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.LeadRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class LeadService {
    private LeadRepository leadRepository;
    private JobRepository jobRepository;
    private VisitRepository visitRepository;

    public LeadService(LeadRepository leadRepository, JobRepository jobRepository, VisitRepository visitRepository) {
        this.leadRepository = leadRepository;
        this.jobRepository = jobRepository;
        this.visitRepository = visitRepository;
    }

    public Optional<Consulta> findById(Long id){
        return leadRepository.findById(id);
    }

    public List<Consulta> findAllByContactDateDesc(){
        return leadRepository.findAllByOrderByIdDesc();
    }

    @Transactional
    public Consulta create(Consulta consulta){
        return leadRepository.save(consulta);
    }

    @Transactional
    public Consulta update(Long id, Consulta details){
        return leadRepository.findById(id)
                .map(existing -> {
                    existing.setProblemDescription(details.getProblemDescription());
                    return existing;
                })
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
    }

    @Transactional
    public void delete(Long id){
        if (jobRepository.existsByConsultaId(id)){
            throw new ResourceNotFoundException("cannot delete lead with existing jobs");
        }

        if (visitRepository.existsByConsultaId(id)){
            throw new RuntimeException("cannot delete lead with existing visits");
        }

        leadRepository.deleteById(id);
    }



}
