package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Lead;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    Optional<Email> findByEmail(String email);
    List<Lead> findByNameContaining(String name);
}
