package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    boolean existsByConsultaId(Long consultaId);
    List<Job> findAllByOrderByIdDesc();

    @Query(value = "SELECT TO_CHAR(work_date, 'YYYY-MM'), COUNT(*) FROM jobs GROUP BY TO_CHAR(work_date, 'YYYY-MM') ORDER BY 1", nativeQuery = true)
    List<Object[]> countJobsPerMonth();

}
