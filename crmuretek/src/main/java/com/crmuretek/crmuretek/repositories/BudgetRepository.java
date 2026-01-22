package com.crmuretek.crmuretek.repositories;

import com.crmuretek.crmuretek.models.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
}
