package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.dto.JobRequestDTO;
import com.crmuretek.crmuretek.dto.PresupuestoRequestDTO;
import com.crmuretek.crmuretek.dto.PresupuestoResponseDTO;
import com.crmuretek.crmuretek.services.PresupuestoService;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/presupuestos")
public class PresupuestoController {

    private final PresupuestoService presupuestoService;

    public PresupuestoController(PresupuestoService presupuestoService) {
        this.presupuestoService = presupuestoService;
    }

    @PostMapping
    public ResponseEntity<PresupuestoResponseDTO> createPresupuesto(@Valid @RequestBody PresupuestoRequestDTO request){
        PresupuestoResponseDTO created = presupuestoService.create(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public List<PresupuestoResponseDTO> getPresupuestos() {
        return presupuestoService.getAll();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PresupuestoResponseDTO> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, Object> body){
        String field = (String) body.get("field");
        boolean value = (Boolean) body.get("value");

        return ResponseEntity.ok(presupuestoService.updateStatus(id, field, value));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PresupuestoResponseDTO> updateInfo(@PathVariable Long id, @RequestBody PresupuestoRequestDTO details){
        PresupuestoResponseDTO presupuesto = presupuestoService.updateInfo(id, details);
        return ResponseEntity.ok(presupuesto);
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<Void> delete(@PathVariable Long id){
        presupuestoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
