package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository extends JpaRepository<Lead, Long> {
}
