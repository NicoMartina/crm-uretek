package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
}
