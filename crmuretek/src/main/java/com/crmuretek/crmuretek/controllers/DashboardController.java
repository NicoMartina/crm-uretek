package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.dto.DashboardSummaryDTO;
import com.crmuretek.crmuretek.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller // Tells Spring this is an API door.
@RequestMapping("/api/dashboard") // All URLs here start with api/dashboard
@CrossOrigin("*") // allows your React App  to talk to this door
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary") // The full URL is now GET /api/dashboard/summary
    public DashboardSummaryDTO getSummary(){
        // We just call the service and return  the result
        // Spring is smart enough to turn the java DTO into JSON object automatically
        return dashboardService.getDashboardSummary();
    }
}
