package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.models.Inventory;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
@Service
public class InventoryService {


    private final InventoryRepository inventoryRepository;
    private static final Long DEFAULT_INVENTORY_ID = 1L;

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
        inventory.setIsoStock(inventory.getIsoStock() - isoToSubstract);
        inventory.setResinaStock(inventory.getResinaStock() - resinaToSubstract);

        // 4. Tell the Librarian to save the new numbers
        inventoryRepository.save(inventory);

    }

    // This helper method removes the duplicate code!
    private Inventory getOrCreateInventory(){
        return inventoryRepository.findById(DEFAULT_INVENTORY_ID)
                .orElseGet(() -> {
                    Inventory newInv = new Inventory();
                    newInv.setId(DEFAULT_INVENTORY_ID);
                    newInv.setIsoStock(0.0);
                    newInv.setResinaStock(0.0);
                    return inventoryRepository.save(newInv);
                });
    }

    @Transactional
    public void addIso(Double amount){
        Inventory inventory = getOrCreateInventory();
        Double currentStock = (inventory.getIsoStock() != null ) ? inventory.getIsoStock() : 0.0;
        inventory.setIsoStock(currentStock + amount);
        inventory.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(inventory);
    }

    public void addResina(Double amount){
        Inventory inventory = getOrCreateInventory();
        Double currentStock = (inventory.getResinaStock() != null) ? inventory.getResinaStock() : 0.0;
        inventory.setResinaStock(currentStock + amount);
        inventory.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(inventory);
    }

    public Inventory getInventory(){
        return inventoryRepository.findById(1L).orElseGet(() -> {
            Inventory newInv = new Inventory();
            newInv.setId(1L);
            newInv.setIsoStock(0.0);
            newInv.setResinaStock(0.0);
            return inventoryRepository.save(newInv);
        });
    }
}
