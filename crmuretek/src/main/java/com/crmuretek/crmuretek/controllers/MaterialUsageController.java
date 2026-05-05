package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.dto.CreateMaterialUsageRequestDTO;
import com.crmuretek.crmuretek.services.MaterialUsageService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/material-usage")
public class MaterialUsageController {

    private final MaterialUsageService materialUsageService;

    public MaterialUsageController(MaterialUsageService materialUsageService) {
        this.materialUsageService = materialUsageService;
    }

    @PostMapping
    public void createMaterialUsage(@RequestBody CreateMaterialUsageRequestDTO request){
        materialUsageService.createMaterialUsage(
                request.getTotalKg(),
                request.getJobId()
        );
    }
}
