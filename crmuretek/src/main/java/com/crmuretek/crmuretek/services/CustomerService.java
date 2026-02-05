package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> findAll(){
        return customerRepository.findAll();
    }

    public Customer create(Customer customer){
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer update(Long id, Customer details){
        return customerRepository.findById(id)
                .map(existing -> {
                    existing.setName(details.getName());

                    existing.setPhoneNumber(details.getPhoneNumber());
                    existing.setEmail(details.getEmail());
                    existing.setAddress(details.getAddress());
                    existing.setProblemDescription(details.getProblemDescription());
                    existing.setSource(details.getSource());
                    existing.setContactChannel(details.getContactChannel());
                    existing.setContactDate(details.getContactDate());

                    return customerRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    @Transactional
    public boolean delete(Long id) {
        return customerRepository.findById(id).map(customer -> {
            if(!customer.getJobs().isEmpty()){
                return false;
            }
            customerRepository.deleteById(id);
            return true;
        }).orElse(false);
    }

}
