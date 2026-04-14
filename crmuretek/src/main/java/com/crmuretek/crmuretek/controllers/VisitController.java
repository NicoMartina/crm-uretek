package com.crmuretek.crmuretek.controllers;


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
    public ResponseEntity<Visit> createVisit(@RequestBody Visit visit){

        System.out.println("Visit date received: " + visit.getVisitDate());
        if (visit.getConsulta() != null && visit.getConsulta().getId() != null){
            Consulta realConsulta = consultaRepository
                    .findById(visit.getConsulta().getId())
                    .orElseThrow(() -> new RuntimeException("Consulta Not Found"));

            visit.setConsulta(realConsulta);
        }

        if (visit.getVisitDate() == null) {
            visit.setStatus(VisitStatus.SOLICITADA);
        } else {
            visit.setStatus(VisitStatus.SCHEDULED);
        }
        return ResponseEntity.ok(visitRepository.save(visit));
    }

    @PatchMapping("/{id}/date")
    public ResponseEntity<Visit> updateVisitDate(@PathVariable Long id, @RequestBody java.util.Map<String, String> body){
        return visitRepository.findById(id).map(visit -> {
            visit.setVisitDate(LocalDate.parse(body.get("visitDate")));
            return ResponseEntity.ok(visitRepository.save(visit));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Visit> getAllVisits(){
        return visitRepository.findAllOrderedByStatusThenDate();
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
