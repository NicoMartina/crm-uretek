package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    private CustomerRepository customerRepository;
    private ConsultaRepository consultaRepository;
    private JobRepository jobRepository;
    private VisitRepository visitRepository;

    public CustomerService(CustomerRepository customerRepository, ConsultaRepository consultaRepository, JobRepository jobRepository, VisitRepository visitRepository) {
        this.customerRepository = customerRepository;
        this.consultaRepository = consultaRepository;
        this.jobRepository = jobRepository;
        this.visitRepository = visitRepository;
    }

    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    public Optional<Customer> findById(Long id){
        return customerRepository.findById(id);
    }

    @Transactional
     public Customer create(Customer customer ){
        return customerRepository.save(customer);
     }

     @Transactional
     public Customer update(Long id, Customer details){
        return customerRepository.findById(id)
                .map(customer -> {
                    customer.setName(details.getName());
                    customer.setEmail(details.getEmail());
                    customer.setPhoneNumber(details.getPhoneNumber());
                    customer.setAddress(details.getAddress());
                    customer.setContactChannel(details.getContactChannel());
                    customer.setSource(details.getSource());
                    customer.setTitle((details.getTitle()));
                    customer.setObservations(details.getObservations());
                    return customerRepository.save(customer);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Consulta not found."));
     }

     @Transactional
    public void delete(Long id){
        if (consultaRepository.existsByCustomer_Id(id)){
            throw new ResourceNotFoundException("Cannot delete customer with exisiting consultas");
        }
        customerRepository.deleteById(id);
     }

}
