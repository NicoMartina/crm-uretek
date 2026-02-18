package com.crmuretek.crmuretek.models;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum SourceEnum {
    FACEBOOK, GOOGLE, WEBSITE, REFERRAL, PHONE, WHATSAPP;

    @JsonCreator
    public static SourceEnum fromString(String value) {
        if (value == null || value.isEmpty()) return null;
        return SourceEnum.valueOf(value.toUpperCase().trim());
    }
}
