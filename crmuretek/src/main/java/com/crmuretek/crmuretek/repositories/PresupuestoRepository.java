package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Presupuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {
}
