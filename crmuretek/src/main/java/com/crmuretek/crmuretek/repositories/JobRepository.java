package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Job;
import com.crmuretek.crmuretek.models.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    boolean existsByLeadId(Long leadId);
    List<Job> findAllByOrderByIdDesc();

    @Query(value = "SELECT TO_CHAR(work_date, 'YYYY-MM'), COUNT(*) FROM jobs GROUP BY TO_CHAR(work_date, 'YYYY-MM') ORDER BY 1", nativeQuery = true)
    List<Object[]> countJobsPerMonth();

}
