package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.dto.ConsultaRequestDTO;
import com.crmuretek.crmuretek.dto.ConsultaResponseDTO;
import com.crmuretek.crmuretek.exceptions.InvalidInputException;
import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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



    @Transactional
    public ConsultaResponseDTO create(ConsultaRequestDTO request) {
        // Step 1 — Build and save the Customer from the form data
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setAddress(request.getAddress());
        customer.setContactChannel(request.getContactChannel());
        customer.setSource(request.getSource());
        customer.setContactDate(request.getContactDate());
        customer.setTitle(request.getTitle());
        customer.setObservations(request.getObservations());

        Customer savedCustomer = customerRepository.save(customer);

        // Step 2 — Build and save the Consulta linked to that Customer
        Consulta consulta = new Consulta();
        consulta.setProblemDescription(request.getProblemDescription());
        consulta.setCustomer(savedCustomer);

        Consulta savedConsulta = consultaRepository.save(consulta);

        // Step 3 — Map to response DTO and return
        return toResponseDTO(savedConsulta, savedCustomer);
    }

    // Private mapper — keeps the method clean
    private ConsultaResponseDTO toResponseDTO(Consulta consulta, Customer customer) {
        ConsultaResponseDTO dto =  new ConsultaResponseDTO();
        dto.setConsultaId(consulta.getId());
        dto.setRequestDate(consulta.getRequestDate());
        dto.setProblemDescription(consulta.getProblemDescription());


        if (customer != null) {
            dto.setCustomerId(customer.getId());
            dto.setName(customer.getName());
            dto.setEmail(customer.getEmail());
            dto.setPhoneNumber(customer.getPhoneNumber());
            dto.setAddress(customer.getAddress());
            dto.setContactChannel(customer.getContactChannel());
            dto.setSource(customer.getSource());
            dto.setTitle(customer.getTitle());
            dto.setObservations(customer.getObservations());
            dto.setContactDate(customer.getContactDate());
        }

        return dto;
    }


    @Transactional
    public ConsultaResponseDTO update(Long id, ConsultaRequestDTO request){
        return consultaRepository.findById(id)
                .map(existing -> {
                    // Update consulta fields
                    existing.setProblemDescription(request.getProblemDescription());

                    // Update customer fields
                    existing.getCustomer().setName(request.getName());
                    existing.getCustomer().setEmail(request.getEmail());
                    existing.getCustomer().setPhoneNumber(request.getPhoneNumber());
                    existing.getCustomer().setAddress(request.getAddress());
                    existing.getCustomer().setContactChannel(request.getContactChannel());
                    existing.getCustomer().setSource(request.getSource());
                    existing.getCustomer().setTitle(request.getTitle());
                    existing.getCustomer().setObservations(request.getObservations());

                    Consulta saved = consultaRepository.save(existing);
                    return toResponseDTO(saved, saved.getCustomer());
                })

                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
    }

    @Transactional
    public void delete(Long id){
        if (jobRepository.existsByConsultaId(id)){
            throw new ResourceNotFoundException("cannot delete lead with existing jobs");
        }

        if (visitRepository.existsByConsultaId(id)){
            throw new InvalidInputException("cannot delete lead with existing visits");
        }

        consultaRepository.deleteById(id);
    }


    public List<ConsultaResponseDTO> findAllByOrderByIdDesc() {
        return consultaRepository.findAllByOrderByIdDesc().stream()
                .map(consulta -> toResponseDTO(consulta, consulta.getCustomer()))
                .collect(Collectors.toList());
    }
}
