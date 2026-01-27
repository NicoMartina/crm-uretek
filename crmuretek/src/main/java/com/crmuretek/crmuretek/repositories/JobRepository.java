package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("SELECT SUM(j.estimateMaterialKg) FROM Job j WHERE j.jobStatus = 'PENDIENTE'")
    Double sumTotalMaterialForPendingJobs();
}
