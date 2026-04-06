package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import com.crmuretek.crmuretek.services.ConsultaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
public class ConsultaController {

    private final ConsultaRepository consultaRepository;
    private final ConsultaService consultaService;


    public ConsultaController(ConsultaRepository consultaRepository, ConsultaService consultaService) {
        this.consultaRepository = consultaRepository;
        this.consultaService = consultaService;
    }

    @PostMapping
    public ResponseEntity<Consulta> create(@RequestBody Consulta consulta){
        return ResponseEntity.ok(consultaService.create(consulta));
    }


    @GetMapping
    public List<Consulta> getAllLeads(){

        return consultaService.findAllByContactDateDesc();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consulta> update(@PathVariable Long id, @RequestBody Consulta consulta){
        return ResponseEntity.ok(consultaService.update(id, consulta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        consultaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
