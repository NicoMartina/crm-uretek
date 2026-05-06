package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.exceptions.InsufficientMaterialException;
import com.crmuretek.crmuretek.exceptions.InvalidInputException;
import com.crmuretek.crmuretek.models.*;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.StockMovementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
public class InventoryService {


    private final InventoryRepository inventoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private static final Long DEFAULT_INVENTORY_ID = 1L;


    public InventoryService(InventoryRepository inventoryRepository, StockMovementRepository stockMovementRepository) {
        this.inventoryRepository = inventoryRepository;
        this.stockMovementRepository = stockMovementRepository;

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
        LocalDateTime now = LocalDateTime.now();
        Double currentStock = (inventory.getIsoStock() != null ) ? inventory.getIsoStock() : 0.0;
        inventory.setIsoStock(currentStock + amount);
        inventory.setLastUpdated(now);

        // CREATE movement
        StockMovement movement = new StockMovement();
        movement.setIsoAmount(amount);
        movement.setResinaAmount(0.0);
        movement.setType(MovementType.ADD);
        movement.setJob(null);
        movement.setMovementDate(now);

        // SAVE
        stockMovementRepository.save(movement);
        inventoryRepository.save(inventory);
    }

    @Transactional
    public void addResina(Double amount){
        Inventory inventory = getOrCreateInventory();
        LocalDateTime now = LocalDateTime.now();
        Double currentStock = (inventory.getResinaStock() != null) ? inventory.getResinaStock() : 0.0;
        inventory.setResinaStock(currentStock + amount);
        inventory.setLastUpdated(now);


        // CREATE movement
        StockMovement movement = new StockMovement();
        movement.setIsoAmount(0.0);
        movement.setResinaAmount(amount);
        movement.setType(MovementType.ADD);
        movement.setJob(null);
        movement.setMovementDate(now);

        // SAVE
        stockMovementRepository.save(movement);
        inventoryRepository.save(inventory);
    }

    @Transactional
    public void useMaterial(Double totalKg, Job job){
        Inventory inventory = getOrCreateInventory();
        LocalDateTime now = LocalDateTime.now();


        Double iso = totalKg * MaterialConstants.ISO_RATIO;
        Double resina = totalKg * MaterialConstants.RESINA_RATIO;

        Double currentIso = inventory.getIsoStock() != null ? inventory.getIsoStock() : 0.0;
        Double currentResina = inventory.getResinaStock() != null ? inventory.getResinaStock() : 0.0;

        // 1. VALIDATE
        if (iso > currentIso || resina > currentResina) {
            throw new InsufficientMaterialException("Not enough stock");
        }

        if (totalKg <= 0) {
            throw new InvalidInputException("Total kg must be positive");
        }

        // 2. UPDATE INVENTORY
        inventory.setIsoStock(currentIso - iso);
        inventory.setResinaStock(currentResina - resina);
        inventory.setLastUpdated(now);

        // 3. CREATE MOVEMENT
        StockMovement movement = new StockMovement();
        movement.setIsoAmount(iso);
        movement.setResinaAmount(resina);
        movement.setType(MovementType.USAGE);
        movement.setJob(job);
        movement.setMovementDate(now);

        // 4. SAVE
        stockMovementRepository.save(movement);
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
