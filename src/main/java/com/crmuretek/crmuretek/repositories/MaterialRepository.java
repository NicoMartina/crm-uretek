package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.MaterialUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<MaterialUsage, Long> {
}
