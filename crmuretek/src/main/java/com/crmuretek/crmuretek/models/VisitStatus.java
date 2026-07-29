package com.crmuretek.crmuretek.models;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum VisitStatus {
    SCHEDULED,
    VISITED,
    SOLICITADA,
    CANCELLED;

    @JsonCreator
    public static VisitStatus fromString(String value){
        if (value == null || value.isEmpty()) return null;
        try {
            return VisitStatus.valueOf(value.toUpperCase().trim());
        } catch (IllegalArgumentException e){
            return null;
        }
    }
}