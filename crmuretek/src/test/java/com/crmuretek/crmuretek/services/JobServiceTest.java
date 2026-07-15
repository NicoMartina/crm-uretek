package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.dto.JobResponseDTO;
import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.models.Job;
import com.crmuretek.crmuretek.models.Consulta;
import com.crmuretek.crmuretek.models.JobStatus;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JobServiceTest {

    // fake versions of the repos so we dont use the actual database
    @Mock
    ConsultaRepository consultaRepository;
    @Mock
    VisitRepository visitRepository;
    @Mock
    JobRepository jobRepository;

    @InjectMocks
    JobService jobService;

    @Test
    void updateJobStatusSuccessfully(){
        Job job = new Job();

        Consulta consulta = new Consulta();
        consulta.setId(1L);
        job.setConsulta(consulta);

        Customer customer = new Customer();
        customer.setId(1L);
        consulta.setCustomer(customer);

        job.setJobStatus(JobStatus.QUOTED);

        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));

        JobResponseDTO result = jobService.updateJobStatus(1L, "COMPLETED");

        assertThat(result.getJobStatus()).isEqualTo(JobStatus.COMPLETED);




    }
}
