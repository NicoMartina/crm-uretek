package com.crmuretek.crmuretek.models;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum SourceEnum {
    GOOGLE, PAGINA_WEB, REDES_SOCIALES, LINKEDIN, RECOMENDACION,
    TRABAJO_ANTERIOR, CONSULTA_ANTERIOR, CAMION,
    OFICINA, BATEV, OTRO;

    @JsonCreator
    public static SourceEnum fromString(String value) {
        if (value == null || value.isEmpty()) return null;
        try{
            return SourceEnum.valueOf(value.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
