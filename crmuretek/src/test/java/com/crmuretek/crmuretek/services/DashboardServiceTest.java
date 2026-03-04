package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.dto.DashboardSummaryDTO;
import com.crmuretek.crmuretek.models.Inventory;
import com.crmuretek.crmuretek.repositories.InventoryRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.ConsultaRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class DashboardServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private ConsultaRepository consultaRepository;

    @Mock
    private VisitRepository visitRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void shouldCalculatePossibleMixCorrectly() {
        // 1. ARRANGE - set up fake data
        Inventory inventory = new Inventory();
        inventory.setIsoStock(126.0);
        inventory.setResinaStock(74.0);

        when(inventoryRepository.findAll()).thenReturn(List.of(inventory));

        // 2. ACT - call the testing method

        DashboardSummaryDTO result = dashboardService.getDashboardSummary();

        // 3. ASSERT - check if the result is the expected one


        assertEquals(200, result.possibleMix());
    }

    @Test
    void valueOfMixIfInventoryIsEmpty(){
        // 1. ARRANGE - set up fake data

        when(inventoryRepository.findAll()).thenReturn(List.of());

        // 2. ACT - call the testing method
        DashboardSummaryDTO isEmpty = dashboardService.getDashboardSummary();


        // 3. ASSERT - check if the result is the expected one
        assertEquals(0.0, isEmpty.possibleMix());
    }


}
