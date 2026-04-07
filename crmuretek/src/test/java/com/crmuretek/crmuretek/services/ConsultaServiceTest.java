package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // This tells JUnit to allow "Fakes" (Mocks)
public class ConsultaServiceTest {

    @Mock
    private ConsultaRepository consultaRepository; // The "Practice Dummy"

    @InjectMocks
    private ConsultaService consultaService; // The real engine we are testing

    @Test
    void shouldSaveConsultaSuccessfully() {
        // GIVEN: We have a new consulta
        Customer fakeCustomer = new Customer();
        fakeCustomer.setName("Uretek Client");

        Consulta input = new Consulta();
        input.setProblemDescription("Foundation crack in the basement");
        input.setCustomer(fakeCustomer);

        // Create what the "Database" will return
        Consulta saved = new Consulta();
        saved.setId(101L); // the database gives it an ID
        saved.setProblemDescription("Foundation crack in the basement");

        // Tell Mockito "when the repo is called  with ANY  consulta, return our 'saved' one"
        when(consultaRepository.save(any(Consulta.class))).thenReturn(saved);

        // 2. WHEN: Run the method  we are testing
        Consulta result =  consultaService.create(input);

        // 3. THEN: Verify the results (The Assertions)
        assertNotNull(result);
        assertEquals(101L, result.getId());
        assertEquals("Foundation crack in the basement", result.getProblemDescription());

        // Verify the repository  was actually touched
        verify(consultaRepository, times(1)).save(any(Consulta.class));
    }


}
