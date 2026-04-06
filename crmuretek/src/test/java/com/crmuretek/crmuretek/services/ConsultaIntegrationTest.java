package com.crmuretek.crmuretek.services;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootTest
@AutoConfigureMockMvc
public class ConsultaIntegrationTest  {

    @Autowired
    private MockMvc mockMvc; // Internal Postman

    @Test
    public void shouldreturnAllConsultas() throws Exception {
        // 1. We tell  the fake Postman to "GET" our URL
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/leads"))
                // 2. We expect the response to be "200 OK"
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
                // 3. Optional: Check if the JSON  is actually there
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$").isArray());
    }

}
