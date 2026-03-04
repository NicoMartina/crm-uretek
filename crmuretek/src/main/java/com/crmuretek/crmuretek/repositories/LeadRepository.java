package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LeadRepository extends JpaRepository<Consulta, Long> {

    List<Consulta> findAllByOrderByIdDesc();

    @Query(value = "SELECT TO_CHAR(c.contact_date, 'YYYY-MM'), COUNT(*) FROM leads l JOIN customers c ON l.customer_id = c.id GROUP BY TO_CHAR(c.contact_date, 'YYYY-MM') ORDER BY 1", nativeQuery = true)
    List<Object[]> countLeadsPerMonth();

    @Query(value = "SELECT TO_CHAR(c.contact_date, 'YYYY-MM'), c.source, COUNT(*) FROM leads l JOIN customers c ON l.customer_id = c.id GROUP BY TO_CHAR(c.contact_date, 'YYYY-MM'), c.source", nativeQuery = true)
    List<Object[]> countLeadsBySource();

}
