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

    @Transactional
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
