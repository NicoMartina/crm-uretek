package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.models.Job;
import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.models.visitStatus;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
public class VisitController {

    @Autowired
    private final VisitRepository visitRepository;

    public VisitController(VisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }

    @PostMapping
    public Visit createVisit(@RequestBody Visit visit){
        return visitRepository.save(visit);
    }

    @GetMapping
    public List<Visit> getAllVisits(){
        return visitRepository.findAll();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Visit> updateVisitStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body){
        return visitRepository.findById(id).map(visit -> {
            try {
                String cleanStatus = body.get("status");
                visit.setStatus(visitStatus.valueOf(cleanStatus.toUpperCase()));

                visitRepository.save(visit);
                return ResponseEntity.ok(visit);
            } catch (Exception e) {
                return ResponseEntity.badRequest().<Visit>build();
            }
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
