package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "https://localhost:5173")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping
    public Customer createaCustomer(@RequestBody Customer customer){
        return customerRepository.save(customer);
    }
}
