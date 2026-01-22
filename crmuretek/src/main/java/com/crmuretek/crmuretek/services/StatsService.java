package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.repositories.BudgetRepository;
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
    @Autowired
    private BudgetRepository budgetRepository;

    public long countVisitsInMonth(int month, int year){
        return visitRepository.findAll().stream()
                .filter(visit -> visit.getVisitDate().getMonthValue() == month
                && visit.getVisitDate().getYear() == year)
                .count();
    }

    public void printMonthlySummary(int month, int year){
        // We use Java Streams to filter by the date fields we created earlier
        long visitCount = visitRepository.findAll().stream()
                .filter(v -> v.getVisitDate().getMonthValue() == month &&
                        v.getVisitDate().getYear() == year)
                .count();

        long jobCount = jobRepository.findAll().stream()
                .filter(j -> j.getWorkDate().getMonthValue() == month &&
                        j.getWorkDate().getYear() == year)
                .count();

        System.out.println("\n--- SUMMARY FOR " + month + "/" + year  + " ---");
        System.out.println("Total Visits: " + visitCount);
        System.out.println("Total");
    }
}
