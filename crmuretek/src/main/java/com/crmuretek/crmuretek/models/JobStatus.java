package com.crmuretek.crmuretek.models;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum JobStatus {
    QUOTED,
    DEPOSIT_PAID,
    BALANCE_PAID,
    COMPLETED;

    @JsonCreator
    public static JobStatus fromString(String value){
        if (value == null || value.isEmpty()) return null;
        try {
            return JobStatus.valueOf(value.toUpperCase().trim());
        } catch (IllegalArgumentException e){
            return null;
        }
    }

}
