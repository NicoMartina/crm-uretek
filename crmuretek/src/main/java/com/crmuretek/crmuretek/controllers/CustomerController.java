package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Customer createaCustomer(@RequestBody Customer customer){
        return customerRepository.save(customer);
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @DeleteMapping("/api/customers/{id}")
    public ResponseEntity<Customer> deleteCustomer(@PathVariable Long id){
        // Check if customer exists first (The Senior Way)
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
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
