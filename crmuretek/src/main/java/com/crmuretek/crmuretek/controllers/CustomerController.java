package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping
    public Customer createaCustomer(@RequestBody Customer customer){
        return customerRepository.save(customer);
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable Long id){
        customerRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
        // 1. Find the existing customer
        return customerRepository.findById(id)
                .map(customer -> {
                    customer.setName(customerDetails.getName());
                    customer.setPhoneNumber(customerDetails.getPhoneNumber());
                    customer.setAddress(customerDetails.getAddress());
                    customer.setVisitDate(customerDetails.getVisitDate());

                    return customerRepository.save(customer);
                })
                .orElseThrow(() -> new RuntimeException("Customer Not found with id " + id));
    }


}
