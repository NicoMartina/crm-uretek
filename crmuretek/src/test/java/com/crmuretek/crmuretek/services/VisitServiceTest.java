package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.dto.ConsultaRequestDTO;
import com.crmuretek.crmuretek.dto.VisitRequestDTO;
import com.crmuretek.crmuretek.dto.VisitResponseDTO;
import com.crmuretek.crmuretek.exceptions.ResourceNotFoundException;
import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.models.Visit;
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

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class VisitServiceTest {

    // fake versions of the repos so we dont use the actual database
    @Mock
    ConsultaRepository consultaRepository;
    @Mock
    CustomerRepository customerRepository;
    @Mock
    VisitRepository visitRepository;
    @Mock
    JobRepository jobRepository;

    // we inject these repos in the real services so we can use them
    @InjectMocks
    VisitService visitService;
    @InjectMocks
    JobService jobService;

    private ConsultaRequestDTO validConsultaRequest;
    private VisitRequestDTO validVisitRequest;
    private Customer savedCustomer;
    private Consulta savedConsulta;
    private Visit savedVisit;

    private LocalDate date;

    @BeforeEach
    void setUp(){
        // Build a valid request — same fields as your Postman body
        validConsultaRequest = new ConsultaRequestDTO();
        validVisitRequest = new VisitRequestDTO();
        validConsultaRequest.setName("Maria Garcia");
        validConsultaRequest.setEmail("maria@example.com");
        validConsultaRequest.setPhoneNumber("1134567890");
        validConsultaRequest.setAddress("Av. Corrientes 1234");
        validConsultaRequest.setProblemDescription("Water leak in basement");

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

        // What the fake visitRepository.save() will return
        savedVisit = new Visit();
        savedVisit.setId(100L);
        savedVisit.setConsulta(savedConsulta);
        savedVisit.setVisitDate(date);
        savedVisit.setObservations("No tocar timbre");


    }

    @Test
    void create_shouldScheduleVisitFromLead_ifRequestIsValid(){
        when(visitRepository.save(any(Visit.class))).thenReturn(savedVisit);
        when(consultaRepository.findById(any())).thenReturn(Optional.of(savedConsulta));


        VisitResponseDTO result = visitService.scheduleVisitFromLead(validVisitRequest);

        assertThat(result).isNotNull();
        assertThat(result.getConsultaId()).isEqualTo(10L);
        assertThat(result.getVisitDate()).isEqualTo(date);
        assertThat(result.getObservations()).isEqualTo("No tocar timbre");

    }

    @Test
    void delete_shouldNotDeleteVisit_whenAttachedJob(){
        when(jobRepository.existsByVisitId(anyLong())).thenReturn(true);
        assertThrows(ResourceNotFoundException.class, () -> visitService.delete(1L));
    }

    @Test
    void findAllOrderedByStatusThenDate_shouldReturnResults_whenVisitsExist(){
        when(visitRepository.findAllOrderedByStatusThenDate()).thenReturn(List.of(savedVisit));
        List<VisitResponseDTO> list = visitService.findAllOrderedByStatusThenDate();
        assertThat(list).isNotEmpty();
    }

}

