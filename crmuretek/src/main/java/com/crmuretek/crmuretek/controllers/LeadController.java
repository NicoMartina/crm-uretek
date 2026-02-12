package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.models.Lead;
import com.crmuretek.crmuretek.repositories.LeadRepository;
import com.crmuretek.crmuretek.services.LeadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadRepository leadRepository;
    private final LeadService leadService;

    public LeadController(LeadRepository leadRepository, LeadService leadService) {
        this.leadRepository = leadRepository;
        this.leadService = leadService;
    }

    @PostMapping
    public ResponseEntity<Lead> createLead(@RequestBody Lead lead){
        return ResponseEntity.ok(leadRepository.save(lead));
    }

    @GetMapping
    public List<Lead> getAllLeads(){
        return leadRepository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(@PathVariable Long id, @RequestBody Lead lead){
        return ResponseEntity.ok(leadService.update(id, lead));
    }
}
