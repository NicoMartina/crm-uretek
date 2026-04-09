package com.crmuretek.crmuretek.dto;

import com.crmuretek.crmuretek.models.LeadContactEnum;
import com.crmuretek.crmuretek.models.SourceEnum;
import com.crmuretek.crmuretek.models.TitleEnum;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class ConsultaRequestDTO {
    // Customer Fields - user fills these in the form
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private LeadContactEnum contactChannel;
    private SourceEnum source;
    private LocalDate contactDate;
    private TitleEnum title;
    private String observations;

    // Consulta Field
    private String problemDescription;

    // Getters and Setters  (or add Lombok @Data to this class)
    // we'll use Lombok
}
