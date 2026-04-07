package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ConsultaIntegrationTest  {

    @Autowired
    private MockMvc mockMvc; // Internal Postman

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    public void shouldreturnAllConsultas() throws Exception {
        // 1. We tell  the fake Postman to "GET" our URL
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/leads"))
                // 2. We expect the response to be "200 OK"
                .andExpect(status().isOk())
                // 3. Optional: Check if the JSON  is actually there
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$").isArray());
    }


    @Test
    public void shouldCreateConsultaWithCustomer() throws Exception {
        // 1. Arrange: Create and save a real Customer first
        Customer customer = new Customer();
        customer.setName("Nicolas Martina");
        customerRepository.save(customer); // the customer now has an id


        // 2. Arrange: Create the JSON
        // we use the id that was created
        String json = """
        {
            "problemDescription": "Hundimiento de piso",
                "requestDate": "2026-04-06",
                "customer": {"id": %d}
        }
        """.formatted(customer.getId());


                // 3. Act (The Action)
                mockMvc.perform(post("/api/leads") // The URL
                        .contentType(MediaType.APPLICATION_JSON) // Telling the app: I'm sending a JSON.
                        .content(json)) // Sending the actual Text

                // 4. Assert ( The Result)
                        .andExpect(status().isOk());  // We expect a "200 OK" or "201 Created"

    }

    @Autowired
    javax.sql.DataSource dataSource;

    @Test
    void showDatabase() throws Exception {
        System.out.println("DB URL = " + dataSource.getConnection().getMetaData().getURL());
    }
}