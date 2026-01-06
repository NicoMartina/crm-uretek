package com.crmuretek.crmuretek;

import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import com.crmuretek.crmuretek.services.VisitService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class CrmuretekApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrmuretekApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(VisitService visitService, VisitRepository visitRepository){
		return (args) -> {
			Visit visit = new Visit();
			visit.setHasPaidVisitFee(false);
			visitRepository.save(visit);

			// Ask the service for the report
			List<Visit> debtors = visitService.getUnpaidVisits();

			System.out.println("ALERTA: You have " + debtors.size()	+ " unpaid visits");
		};
	}
}
