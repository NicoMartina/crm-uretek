package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.dto.ConsultaRequestDTO;
import com.crmuretek.crmuretek.dto.ConsultaResponseDTO;
import com.crmuretek.crmuretek.services.ConsultaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
public class ConsultaController {

    private final ConsultaService consultaService;


    public ConsultaController(ConsultaService consultaService) {
        this.consultaService = consultaService;
    }

    @PostMapping
    public ResponseEntity<ConsultaResponseDTO> create(@RequestBody ConsultaRequestDTO consulta) {
            ConsultaResponseDTO created = consultaService.create(consulta);
            return ResponseEntity.status(201).body(created);
    }


    @GetMapping
    public ResponseEntity<List<ConsultaResponseDTO>> getAllLeads(){
        return ResponseEntity.ok(consultaService.findAllByOrderByIdDesc());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultaResponseDTO> update(@PathVariable Long id, @RequestBody ConsultaRequestDTO request){
        return ResponseEntity.ok(consultaService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        consultaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
