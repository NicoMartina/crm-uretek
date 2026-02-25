package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Job;
import com.crmuretek.crmuretek.models.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("SELECT SUM(j.totalAmount) FROM Job j WHERE j.jobStatus = 'QUOTED'")
    Double sumQuotedAmount();

    @Query("SELECT SUM(j.totalAmount) FROM Job j WHERE j.jobStatus = 'IN_PROGRESS'")
    Double sumActiveAmount();

    @Query("SELECT SUM(j.estimateMaterialKg) FROM Job j WHERE j.jobStatus = 'IN_PROGRESS'")
    Double sumRequiredMaterial();

    boolean existsByLeadId(Long leadId);
    List<Job> findAllByOrderByIdDesc();

}
