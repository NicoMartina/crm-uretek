package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.models.Lead;
import com.crmuretek.crmuretek.repositories.LeadRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadRepository leadRepository;

    public LeadController(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    @PostMapping
    public ResponseEntity<Lead> createLead(@RequestBody Lead lead){
        return ResponseEntity.ok(leadRepository.save(lead));
    }

    @GetMapping
    public List<Lead> getAllLeads(){
        return leadRepository.findAll();
    }
}
