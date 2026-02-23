package com.crmuretek.crmuretek.models;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Currency {
    ARS,
    USD;

    @JsonCreator
    public static Currency fromString(String value){
        if (value == null || value.isEmpty()) return null;
        try {
            return Currency.valueOf(value.toUpperCase().trim());
        } catch (IllegalArgumentException e){
            return null;
        }
    }

}


