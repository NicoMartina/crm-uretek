package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
}
