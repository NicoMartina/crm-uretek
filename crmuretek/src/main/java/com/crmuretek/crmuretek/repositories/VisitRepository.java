package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.models.VisitStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    boolean existsByLeadId(Long leadId);
    List<Visit> findByStatus(VisitStatus status);
    List<Visit> findByVisitDate(LocalDate date);

}
