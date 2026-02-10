package com.crmuretek.crmuretek.config;

import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.models.Inventory;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initInventory(CustomerRepository customerRepository, InventoryRepository inventoryRepository){
        return args -> {
            // 1. Initialize the inventory
            if (inventoryRepository.count() == 0){
                Inventory initialStock = new Inventory();
                initialStock.setIso_stock(0.0);
                initialStock.setResina_stock(0.0);
                initialStock.setLastUpdated(LocalDateTime.now());
                inventoryRepository.save(initialStock);
            }

            // 2. Initialize a Test Customer  to always have ID #1
            if (customerRepository.count() == 0) {
                Customer c = new Customer();
                c.setName("Cliente de Prueba");
                c.setPhoneNumber("123456789");
                c.setEmail("email@uretek.com");
                c.setAddress("122 Main Street ");
                customerRepository.save(c);
                System.out.println(">> Cliente  inicial creado con exito (ID: 1)");
            }
        };
    }
}
