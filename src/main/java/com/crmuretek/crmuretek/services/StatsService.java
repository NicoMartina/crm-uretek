package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

    @Autowired
    private VisitRepository visitRepository;
    @Autowired
    private JobRepository jobRepository;

    public long countVisitsInMonth(int month, int year){
        return visitRepository.findAll().stream()
                .filter(visit -> visit.getVisitDate().getMonthValue() == month
                && visit.getVisitDate().getYear() == year)
                .count();
    }
}
