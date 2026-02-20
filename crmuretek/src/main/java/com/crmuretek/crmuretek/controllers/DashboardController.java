package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.dto.DashboardSummaryDTO;
import com.crmuretek.crmuretek.services.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {


    private DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummaryDTO getSummary(){
        return dashboardService.getDashboardSummary();
    }
}
