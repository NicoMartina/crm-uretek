package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping
    public Customer createaCustomer(@Valid @RequestBody Customer customer){
        return customerRepository.save(customer);
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id){
        return customerRepository.findById(id)
                .map( customer -> {
                    if (!customer.getJobs().isEmpty()){
                        return ResponseEntity.status(HttpStatus.CONFLICT).<Void>build();
                    }
                    customerRepository.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
        })
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @Valid @RequestBody Customer customerDetails) {
        // 1. Find the existing customer
        return customerRepository.findById(id)
                .map(customer -> {
                    customer.setName(customerDetails.getName());
                    customer.setPhoneNumber(customerDetails.getPhoneNumber());
                    customer.setEmail(customerDetails.getEmail());
                    customer.setAddress(customerDetails.getAddress());
                    customer.setProblemDescription(customerDetails.getProblemDescription());
                    customer.setSource(customerDetails.getSource());
                    customer.setContactChannel(customerDetails.getContactChannel());
                    customer.setContactDate(customerDetails.getContactDate());
                    customer.setRequestVisit(customerDetails.getRequestVisit());
                    customer.setVisitDate(customerDetails.getVisitDate());

                    return customerRepository.save(customer);
                })
                .orElseThrow(() -> new RuntimeException("Customer Not found with id " + id));
    }


}
