package com.crmuretek.crmuretek.models;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum LeadContactEnum {
    WHATSAPP, TELEFONO, EMAIL, PAGINA_WEB,
    REDES_SOCIALES, TECNICO, OTRO;


    @JsonCreator
    public static LeadContactEnum fromString(String value) {
        if (value == null || value.isEmpty()) return null;
        try {
            return LeadContactEnum.valueOf(value.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            return null; // or throw, depending on your preference
        }
    }
}
