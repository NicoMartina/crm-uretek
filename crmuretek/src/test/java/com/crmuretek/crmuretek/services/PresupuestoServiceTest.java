package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.dto.PresupuestoRequestDTO;
import com.crmuretek.crmuretek.dto.PresupuestoResponseDTO;
import com.crmuretek.crmuretek.exceptions.InvalidInputException;
import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.models.Presupuesto;
import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.PresupuestoRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PresupuestoServiceTest {

    @Mock
    VisitRepository visitRepository;
    @Mock
    JobRepository jobRepository;
    @Mock
    PresupuestoRepository presupuestoRepository;

    @InjectMocks
    PresupuestoService presupuestoService;

    @Test
    void createPresupuestoSuccessfully(){
        // we mock the environment

        // set customer
        Customer customer = new Customer();
        customer.setId(1L);

        // set consulta
        Consulta consulta = new Consulta();
        consulta.setId(1L);
        consulta.setCustomer(customer);

        // set visit
        Visit visit = new Visit();
        visit.setId(1L);
        visit.setConsulta(consulta);

        // set presupuesto
        Presupuesto presupuesto = new Presupuesto();
        presupuesto.setId(1L);
        presupuesto.setVisit(visit);


        // set request
        PresupuestoRequestDTO request = new PresupuestoRequestDTO();
        request.setVisitId(1L);
        request.setPresupuestoNumber("P-001");
        request.setAmount(50000.0);



        // ARRANGE
        when(visitRepository.findById(1L)).thenReturn(Optional.of(visit));
        when(presupuestoRepository.save(any())).thenReturn(presupuesto);

        // ACT
        PresupuestoResponseDTO result = presupuestoService.create(request);

        // ASSERT
        assertThat(result).isNotNull();
    }

    @Test
    void updateStatusSuccessfully(){
        // we mock the environment

        // set customer
        Customer customer = new Customer();
        customer.setId(1L);

        // set consulta
        Consulta consulta = new Consulta();
        consulta.setId(1L);
        consulta.setCustomer(customer);

        // set visit
        Visit visit = new Visit();
        visit.setId(1L);
        visit.setConsulta(consulta);

        // set presupuesto
        Presupuesto presupuesto = new Presupuesto();
        presupuesto.setId(1L);
        presupuesto.setVisit(visit);

        //ARRANGE
        when(presupuestoRepository.findById(1L)).thenReturn(Optional.of(presupuesto));
        when(presupuestoRepository.save(any())).thenReturn(presupuesto);


        // ACT
        PresupuestoResponseDTO response = presupuestoService.updateStatus(1L, "sent", true);

        // ASSERT
        assertThat(presupuesto).isNotNull();
    }

    @Test
    void updateStatusWithInvalidFieldThrowsException() {
        // we mock the environment

        //customer
        Customer customer = new Customer();
        customer.setId(1L);

        //consulta
        Consulta consulta = new Consulta();
        consulta.setId(1L);
        consulta.setCustomer(customer);

        //visit
        Visit visit = new Visit();
        visit.setId(1L);
        visit.setConsulta(consulta);

        //Presupuesto
        Presupuesto presupuesto = new Presupuesto();
        presupuesto.setId(1L);
        presupuesto.setVisit(visit);

        // ARRANGE
        when(presupuestoRepository.findById(1L)).thenReturn(Optional.of(presupuesto));



        // ACT + ASSERT
        assertThrows(InvalidInputException.class, () ->
                presupuestoService.updateStatus(1L, "Invalid", true));
    }
}
