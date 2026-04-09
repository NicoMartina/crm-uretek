package com.crmuretek.crmuretek.dto;

import com.crmuretek.crmuretek.models.LeadContactEnum;
import com.crmuretek.crmuretek.models.SourceEnum;
import com.crmuretek.crmuretek.models.TitleEnum;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
public class ConsultaResponseDTO {

    // Consulta Identity
    private Long consultaId;
    private LocalDate requestDate;
    private String problemDescription;

    // Customer info flattened — no nesting, no circular reference possible
    private Long customerId;
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private LeadContactEnum contactChannel;
    private SourceEnum source;
    private TitleEnum title;
    private String observations;
    private LocalDate contactDate;

    // Getters and Setters
}
