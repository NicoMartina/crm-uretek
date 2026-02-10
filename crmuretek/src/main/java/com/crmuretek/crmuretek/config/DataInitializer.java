package com.crmuretek.crmuretek.config;

import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.models.Inventory;
import com.crmuretek.crmuretek.models.Lead;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import com.crmuretek.crmuretek.repositories.LeadRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initInventory(CustomerRepository customerRepository,
                                    InventoryRepository inventoryRepository,
                                    LeadRepository leadRepository) {
        return args -> {
            // 1. Initialize the inventory
            if (inventoryRepository.count() == 0){
                Inventory initialStock = new Inventory();
                initialStock.setIso_stock(0.0);
                initialStock.setResina_stock(0.0);
                initialStock.setLastUpdated(LocalDateTime.now());
                inventoryRepository.save(initialStock);
            }

            // 2. Initialize a Test Customer  to always have ID #1 and so we can reference it to Leads
            Customer testCustomer;
            if (customerRepository.count() == 0) {
                testCustomer = new Customer();
                testCustomer.setName("Cliente de Prueba");
                testCustomer.setPhoneNumber("123456789");
                testCustomer.setEmail("email@uretek.com");
                testCustomer.setAddress("122 Main Street ");
                customerRepository.save(testCustomer);
                System.out.println(">> Cliente  inicial creado con exito (ID: 1)");
            } else {
                testCustomer = customerRepository.findAll().get(0);
            }

            // 3. Lead - Linked to the Customer
            if (leadRepository.count() == 0) {
                Lead lead = new Lead();
                lead.setCustomer(testCustomer); // Use the customer you created above
                lead.setProblemDescription("Initial test lead from startup");
                leadRepository.save(lead);
                System.out.println(">> Lead inicial creado (ID: 1)");
            }
        };
    }
}
