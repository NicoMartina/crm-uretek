package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.models.Consulta;
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
    public ResponseEntity<Consulta> create(@RequestBody Consulta consulta){
        return ResponseEntity.ok(leadService.create(consulta));
    }

    @GetMapping
    public List<Consulta> getAllLeads(){
        return leadService.findAllByContactDateDesc();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consulta> update(@PathVariable Long id, @RequestBody Consulta consulta){
        return ResponseEntity.ok(leadService.update(id, consulta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        leadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
