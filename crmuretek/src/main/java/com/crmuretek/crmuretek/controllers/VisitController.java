package com.crmuretek.crmuretek.controllers;


import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.models.VisitStatus;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import com.crmuretek.crmuretek.services.VisitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
public class VisitController {

    private final VisitRepository visitRepository;
    private final VisitService visitService;

    public VisitController(VisitRepository visitRepository, VisitService visitService) {
        this.visitRepository = visitRepository;
        this.visitService = visitService;
    }

    @PostMapping
    public ResponseEntity<Visit> createVisit(@RequestBody Visit visit){
        // 1. If a lead is provided in the request, let's link it
        if (visit.getConsulta() != null && visit.getConsulta().getId() != null){
            // We set the status based on our workflow
            visit.setStatus(VisitStatus.SCHEDULED);
        }
        return ResponseEntity.ok(visitRepository.save(visit));
    }

    @GetMapping
    public List<Visit> getAllVisits(){
        return visitRepository.findAllByOrderByVisitDateDesc();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Visit> updateVisitStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body){
        Visit updated = visitService.updateStatus(id, body.get("status"));
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/observations")
    public ResponseEntity<Visit> updateObservations(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        return visitRepository.findById(id).map(visit -> {
            visit.setObservations(body.get("observations"));
            return ResponseEntity.ok(visitRepository.save(visit));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<Void> deleteVisit(@PathVariable Long id){
        if (visitRepository.existsById(id)) {
            visitRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }




}
