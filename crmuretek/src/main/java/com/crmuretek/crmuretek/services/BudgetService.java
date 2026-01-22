package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired
    private VisitRepository visitRepository;

    // Finds visits where hasPaidVisitFee is false.
    public List<Visit> getUnpaidVisits(){
        return visitRepository.findAll().stream()
                .filter(visit -> !visit.isHasPaidVisitFee())
                .collect(Collectors.toList());
    }
}
