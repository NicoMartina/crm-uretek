package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.models.Inventory;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryService {


    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public void consumeMaterial(Double totalMixUsed){
        // 1. Get the current stock (assuming ID 1 is our only warehouse)
        Inventory inventory = inventoryRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Inventory not initialized."));

        // 2. Do the math
        Double isoToSubstract = totalMixUsed * .63;
        Double resinaToSubstract = totalMixUsed * .37;

        // 3. Update the levels
        inventory.setIso_stock(inventory.getIso_stock() - isoToSubstract);
        inventory.setResina_stock(inventory.getResina_stock() - resinaToSubstract);

        // 4. Tell the Librarian to save the new numbers
        inventoryRepository.save(inventory);

    }

    public void addIso(Double amount){
        Inventory inventory = inventoryRepository.findById(1L)
                .orElseGet(() -> {
                    Inventory newInv = new Inventory();
                    newInv.setId(1L);
                    newInv.setIso_stock(0.0);
                    newInv.setResina_stock(0.0);
                    return inventoryRepository.save(newInv);
                });
        Double currentStock = (inventory.getIso_stock() != null ) ? inventory.getIso_stock() : 0.0;

        inventory.setIso_stock(currentStock + amount);
        inventoryRepository.save(inventory);
    }

    public void addResina(Double amount){
        Inventory inventory = inventoryRepository.findById(1L)
                .orElseGet(() -> {
                    Inventory newInv = new Inventory();
                    newInv.setId(1L);
                    newInv.setIso_stock(0.0);
                    newInv.setResina_stock(0.0);
                    return inventoryRepository.save(newInv);
                });

        Double currentStock = (inventory.getResina_stock() != null) ? inventory.getResina_stock() : 0.0;
        inventory.setResina_stock(currentStock + amount);
        inventoryRepository.save(inventory);
    }

    public Inventory getInventory(){
        return inventoryRepository.findById(1L).orElseGet(() -> {
            Inventory newInv = new Inventory();
            newInv.setId(1L);
            newInv.setIso_stock(0.0);
            newInv.setResina_stock(0.0);
            return inventoryRepository.save(newInv);
        });
    }
}
