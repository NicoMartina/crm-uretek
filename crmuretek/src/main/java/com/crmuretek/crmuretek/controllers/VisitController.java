package com.crmuretek.crmuretek.controllers;


import com.crmuretek.crmuretek.dto.VisitRequestDTO;
import com.crmuretek.crmuretek.dto.VisitResponseDTO;
import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.models.VisitStatus;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import com.crmuretek.crmuretek.services.VisitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/visits")
public class VisitController {

    private final VisitRepository visitRepository;
    private final VisitService visitService;
    private final ConsultaRepository consultaRepository;

    public VisitController(VisitRepository visitRepository, VisitService visitService, ConsultaRepository consultaRepository) {
        this.visitRepository = visitRepository;
        this.visitService = visitService;
        this.consultaRepository = consultaRepository;
    }

    @PostMapping
    public ResponseEntity<VisitResponseDTO> createVisit(@RequestBody VisitRequestDTO visit){
        VisitResponseDTO created = visitService.scheduleVisitFromLead(visit);
        return ResponseEntity.ok(created);
    }

    @PatchMapping("/{id}/date")
    public ResponseEntity<Visit> updateVisitDate(@PathVariable Long id, @RequestBody java.util.Map<String, String> body){
        return visitRepository.findById(id).map(visit -> {
            visit.setVisitDate(LocalDate.parse(body.get("visitDate")));
            return ResponseEntity.ok(visitRepository.save(visit));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<VisitResponseDTO> getAllVisits(){
        return visitService.findAllOrderedByStatusThenDate();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<VisitResponseDTO> updateVisitStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body){
        return ResponseEntity.ok(visitService.updateStatus(id, body.get("status")));
    }

    @PatchMapping("/{id}/observations")
    public ResponseEntity<VisitResponseDTO> updateObservations(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        return ResponseEntity.ok(visitService.updateObservations(id, body.get("observations")));
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<Void> deleteVisit(@PathVariable Long id){
        visitService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
