package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    // Check your JobRepository.java - Copy this exactly
    @Query("SELECT SUM(j.totalAmount) FROM Job j WHERE j.jobStatus = 'QUOTED'")
    Double sumQuotedAmount();

    @Query("SELECT SUM(j.totalAmount) FROM Job j WHERE j.jobStatus = 'IN_PROGRESS'")
    Double sumActiveAmount();

    @Query("SELECT SUM(j.estimateMaterialKg) FROM Job j WHERE j.jobStatus = 'IN_PROGRESS'")
    Double sumRequiredMaterial();
}
