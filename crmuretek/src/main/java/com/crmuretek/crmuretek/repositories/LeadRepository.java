package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Lead;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    Optional<Email> findByEmail(String email);
    List<Lead> findByNameContaining(String name);
    List<Lead> findByPhoneNumber(String phoneNumber);
    List<Lead> findAllByOrderByContactDateDesc();

    @Query(value = "SELECT TO_CHAR(contact_date, 'YYYY-MM'), COUNT(*) FROM leads GROUP BY TO_CHAR(contact_date, 'YYYY-MM') ORDER BY 1", nativeQuery = true)
    List<Object[]> countLeadsPerMonth();

    @Query(value = "SELECT source, COUNT(*) FROM leads GROUP BY source", nativeQuery = true)
    List<Object[]> countLeadsBySource();

}
