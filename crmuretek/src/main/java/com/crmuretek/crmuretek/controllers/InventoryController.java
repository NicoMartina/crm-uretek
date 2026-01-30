package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.models.Inventory;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import com.crmuretek.crmuretek.services.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {


    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public Inventory getInventory(){
        return inventoryService.getInventory();
    }

    @PostMapping("/add-iso")
    public ResponseEntity<Void> addIso(@RequestBody java.util.Map<String, Double> body){
        inventoryService.addIso(body.get("amount"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/add-resina")
    public ResponseEntity<Void> addResina(@RequestBody java.util.Map<String, Double> body){
        inventoryService.addResina(body.get("amount"));
        return ResponseEntity.ok().build();
    }
}
