package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.exceptions.InsufficientMaterialException;
import com.crmuretek.crmuretek.exceptions.InvalidInputException;
import com.crmuretek.crmuretek.models.Inventory;
import com.crmuretek.crmuretek.models.Job;
import com.crmuretek.crmuretek.models.StockMovement;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import com.crmuretek.crmuretek.repositories.StockMovementRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class InventoryServiceTest {

    @Mock
    InventoryRepository inventoryRepository;
    @Mock
    StockMovementRepository stockMovementRepository;

    @InjectMocks
    InventoryService inventoryService;


    @Test
    public void shouldUseMaterialSuccessfully(){
        Inventory inventory = new Inventory();
        inventory.setIsoStock(100.0);
        inventory.setResinaStock(50.0);

        Job job = new Job();

        when(inventoryRepository.findById(1L))
                .thenReturn(Optional.of(inventory));

        // ACT
        inventoryService.useMaterial(10.0, job);

        // ASSERT
        assertEquals(93.7, inventory.getIsoStock(), 0.001);
        assertEquals(46.3, inventory.getResinaStock(), 0.001);

        verify(inventoryRepository).save(inventory);
        verify(stockMovementRepository)
                .save(any(StockMovement.class));
    }

    @Test
    public void shouldThrowExceptionWhenStockIsInsufficient(){
        Inventory inventory = new Inventory();
        inventory.setIsoStock(1.0);
        inventory.setResinaStock(1.0);
        Job job = new Job();

        when(inventoryRepository.findById(1L))
                .thenReturn(Optional.of(inventory));



        assertThrows(InsufficientMaterialException.class, () ->
                inventoryService.useMaterial(10.0, job));

        verify(inventoryRepository, never())
                .save(any());

        verify(stockMovementRepository, never())
                .save(any(StockMovement.class));
    }


    @Test
    public void shouldThrowExceptionWhenInvalidInput(){
        Inventory inventory = new Inventory();
        inventory.setIsoStock(50.0);
        inventory.setResinaStock(50.0);
        Job job = new Job();

        when(inventoryRepository.findById(1L))
                .thenReturn(Optional.of(inventory));

        assertThrows(InvalidInputException.class, () ->
                inventoryService.useMaterial(-10.0, job));

        verify(inventoryRepository, never())
                .save(any());

        verify(stockMovementRepository, never())
                .save(any(StockMovement.class));
    }

    @Test
    public void shouldAddIsoSuccessfully() {
        Inventory inventory = new Inventory();
        inventory.setIsoStock(100.0);
        inventory.setResinaStock(50.0);

        when(inventoryRepository.findById(1L))
                .thenReturn(Optional.of(inventory));

        inventoryService.addIso(50.0);

        assertEquals(150.0, inventory.getIsoStock(), 0.001);

        verify(inventoryRepository).save(inventory);
        verify(stockMovementRepository).save(any(StockMovement.class));
    }

    /*@Test
    public void shouldCreateInventoryWhenAddingIsoAndInventoryDoesNotExist() {
        when(inventoryRepository.findById(1L))
                .thenReturn(Optional.empty());
    }*/
    


}
