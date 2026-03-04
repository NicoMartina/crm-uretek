package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultaService {
    private ConsultaRepository consultaRepository;
    private JobRepository jobRepository;
    private VisitRepository visitRepository;

    public ConsultaService(ConsultaRepository consultaRepository, JobRepository jobRepository, VisitRepository visitRepository) {
        this.consultaRepository = consultaRepository;
        this.jobRepository = jobRepository;
        this.visitRepository = visitRepository;
    }

    public Optional<Consulta> findById(Long id){
        return consultaRepository.findById(id);
    }

    public List<Consulta> findAllByContactDateDesc(){
        return consultaRepository.findAllByOrderByIdDesc();
    }

    @Transactional
    public Consulta create(Consulta consulta){
        return consultaRepository.save(consulta);
    }

    @Transactional
    public Consulta update(Long id, Consulta details){
        return consultaRepository.findById(id)
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

        consultaRepository.deleteById(id);
    }



}
