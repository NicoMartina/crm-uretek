package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.dto.ConsultaRequestDTO;
import com.crmuretek.crmuretek.dto.ConsultaResponseDTO;
import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ConsultaServiceTest {

    // These are FAKE versions — Mockito creates them
    // They don't talk to any database
    @Mock
    private ConsultaRepository consultaRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private JobRepository jobRepository;
    @Mock
    private VisitRepository visitRepository;

    // This is the REAL service — but injected with the fake repos above
    @InjectMocks
    private ConsultaService consultaService;

    @InjectMocks
    private JobService jobService;

    private ConsultaRequestDTO validRequest;
    private Customer savedCustomer;
    private Consulta savedConsulta;

    @BeforeEach
    void setUp() {
        // Build a valid request — same fields as your Postman body
        validRequest = new ConsultaRequestDTO();
        validRequest.setName("Maria Garcia");
        validRequest.setEmail("maria@example.com");
        validRequest.setPhoneNumber("1134567890");
        validRequest.setAddress("Av. Corrientes 1234");
        validRequest.setProblemDescription("Water leak in basement");

        // What the fake customerRepository.save() will return
        savedCustomer = new Customer();
        savedCustomer.setId(1L);
        savedCustomer.setName("Maria Garcia");
        savedCustomer.setEmail("maria@example.com");
        savedCustomer.setPhoneNumber("1134567890");
        savedCustomer.setAddress("Av. Corrientes 1234");

        // What the fake consultaRepository.save() will return
        savedConsulta = new Consulta();
        savedConsulta.setId(10L);
        savedConsulta.setProblemDescription("Water leak in basement");
        savedConsulta.setCustomer(savedCustomer);
    }

    @Test
    void delete_shouldNotDeleteConsulta_whenJobsAttached(){
        // ARRANGE
        when(jobRepository.existsByConsultaId(any())).thenReturn(true);
        // ACT and ASSERT
        assertThrows(ResourceNotFoundException.class, () -> consultaService.delete(1L));
    }

    @Test
    void  delete_shouldNotDeleteConsulta_whenVisitsAttached(){
        when(visitRepository.existsByConsultaId(any())).thenReturn(true);
        assertThrows(RuntimeException.class, () -> consultaService.delete(1L));
    }

    @Test
    void create_shouldSaveCustomerAndConsulta_whenValidRequestProvided() {

        // ARRANGE — tell the fake repos what to return when save() is called
        when(customerRepository.save(any(Customer.class))).thenReturn(savedCustomer);
        when(consultaRepository.save(any(Consulta.class))).thenReturn(savedConsulta);

        // ACT — call the real method with our fake request
        ConsultaResponseDTO result = consultaService.create(validRequest);

        // ASSERT — verify the result is correct
        assertThat(result).isNotNull();
        assertThat(result.getConsultaId()).isEqualTo(10L);
        assertThat(result.getName()).isEqualTo("Maria Garcia");
        assertThat(result.getProblemDescription()).isEqualTo("Water leak in basement");
        assertThat(result.getCustomerId()).isEqualTo(1L);

        // Verify both saves actually happened — once each
        verify(customerRepository).save(any(Customer.class));
        verify(consultaRepository).save(any(Consulta.class));
    }

    @Test
    void create_shouldReturnCorrectCustomerName_whenRequestHasName(){
        // ARRANGE
        when(customerRepository.save(any(Customer.class))).thenReturn(savedCustomer);
        when(consultaRepository.save(any(Consulta.class))).thenReturn(savedConsulta);

        // ACT
        ConsultaResponseDTO result = consultaService.create(validRequest);

        // ASSERT
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Maria Garcia");

        // Verify both saves actually happened — once each
        verify(customerRepository).save(any(Customer.class));
        verify(consultaRepository).save(any(Consulta.class));

    }


    /*@Test
    void findAllByOrderByIdDesc_shouldReturnResults_whenConsultasExist() {
        // ARRANGE
        when(consultaRepository.findAllByOrderByIdDesc()).thenReturn(List.of(savedConsulta));

        // ACT
        List<ConsultaResponseDTO> result = consultaService.findAllByOrderByIdDesc();

        // ASSERT
        assertThat(result).isNotEmpty();

    }*/


    @Test
    void create_shouldSaveCustomerWithCorrectEmail_whenEmailProvided() {
        // ARRANGE
        when(customerRepository.save(any(Customer.class))).thenReturn(savedCustomer);
        when(consultaRepository.save(any(Consulta.class))).thenReturn(savedConsulta);

        // ACT
        ConsultaResponseDTO result = consultaService.create(validRequest);

        // ASSERT
        assertThat(result.getEmail()).isEqualTo("maria@example.com");

        // VERIFY
        verify(customerRepository).save(any(Customer.class));
        verify(consultaRepository).save(any(Consulta.class));

    }

    /*@Test
    void findAllByOrderByIdDesc_shouldReturnOneItem_whenOneConsultaExists() {
        // ARRANGE
        when(consultaRepository.findAllByOrderByIdDesc()).thenReturn(List.of(savedConsulta));

        // ACT
        List<ConsultaResponseDTO> result = consultaService.findAllByOrderByIdDesc();

        // ASSERT
        assertThat(result).isNotEmpty();

    }
     */

}