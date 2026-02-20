package com.crmuretek.crmuretek.config;
import com.crmuretek.crmuretek.models.Inventory;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initInventory(InventoryRepository inventoryRepository) {
        return args -> {
            if (inventoryRepository.count() == 0){
                Inventory initialStock = new Inventory();
                initialStock.setIsoStock(0.0);
                initialStock.setResinaStock(0.0);
                initialStock.setLastUpdated(LocalDateTime.now());
                inventoryRepository.save(initialStock);

                System.out.println(">> Inventario inicial creado");
            }
        };
    }
}
