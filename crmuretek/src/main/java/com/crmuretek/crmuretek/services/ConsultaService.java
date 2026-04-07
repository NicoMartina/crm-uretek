package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultaService {
    private ConsultaRepository consultaRepository;
    private JobRepository jobRepository;
    private VisitRepository visitRepository;
    private CustomerRepository customerRepository;

    public ConsultaService(ConsultaRepository consultaRepository, JobRepository jobRepository, VisitRepository visitRepository, CustomerRepository customerRepository) {
        this.consultaRepository = consultaRepository;
        this.jobRepository = jobRepository;
        this.visitRepository = visitRepository;
        this.customerRepository = customerRepository;
    }

    public Optional<Consulta> findById(Long id){
        return consultaRepository.findById(id);
    }

    public List<Consulta> findAllByContactDateDesc(){
        return consultaRepository.findAllByOrderByIdDesc();
    }

    @Transactional
    public Consulta create(Consulta consulta){
        // 1. Check if the incoming request actually mentioned a customer
        if (consulta.getCustomer() != null && consulta.getCustomer().getId() != null) {

            // 2. GO to the database and get the Real customer that hibernate knows

            Customer managedCustomer = customerRepository.findById(consulta.getCustomer().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + consulta.getCustomer().getId()));

            // 3. Swap the fake customer for the real one
            consulta.setCustomer(managedCustomer);
        }

        // 4. Now hibernate knows which customer to return
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
