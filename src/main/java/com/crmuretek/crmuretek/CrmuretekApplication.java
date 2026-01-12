package com.crmuretek.crmuretek;

import com.crmuretek.crmuretek.models.Customer;
import com.crmuretek.crmuretek.models.Job;
import com.crmuretek.crmuretek.models.MaterialUsage;
import com.crmuretek.crmuretek.models.Visit;
import com.crmuretek.crmuretek.repositories.CustomerRepository;
import com.crmuretek.crmuretek.repositories.JobRepository;
import com.crmuretek.crmuretek.repositories.MaterialUsageRepository;
import com.crmuretek.crmuretek.repositories.VisitRepository;
import com.crmuretek.crmuretek.services.VisitService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;
import java.util.Optional;
import java.util.Scanner;

@SpringBootApplication
public class CrmuretekApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrmuretekApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(
			CustomerRepository customerRepository,
			VisitService visitService,
			JobRepository jobRepository,
			MaterialUsageRepository materialUsageRepository) {
		return (args) -> {
			Scanner scanner = new Scanner(System.in);
			boolean running = true;

			System.out.println("--- WELCOME TO CRM URETEK v1.0 ---");

			while(running) {
				System.out.println("\n******************************");
				System.out.println("1. [REPORT] View Unpaid Visits");
				System.out.println("2. [DATA] Add New Customer");
				System.out.println("3. [DATA] View All Customers");
				System.out.println("4. [DATA] Add  New Job");
				System.out.println("5. [DATA] View All Jobs");
				System.out.println("6. [DATA] Material Usage");
				System.out.println("7. [EXIT] Close System");
				System.out.print("Select an option: ");

				String input = scanner.nextLine();

				switch (input) {
					case "1" -> {
						var unpaid = visitService.getUnpaidVisits();
						System.out.println("\n>>> UNPAID VISITS REPORTS <<<");
						if (unpaid.isEmpty()){
							System.out.println("Great news! All visits have been paid");
						} else {
							unpaid.forEach(v -> System.out.println("Visit ID: " + v.getId() + " | Date: " + v.getVisitDate()));
							System.out.println("Total pending: " + unpaid.size());
						}
					}
					case "2" -> {
						System.out.println("Enter Customer Name: ");
						String name = scanner.nextLine();
						Customer c = new Customer();
						c.setName(name);
						customerRepository.save(c);
						System.out.println("SUCCESS: " + name + " saved to database.");
					}
					case "3" -> {
						System.out.println("\n>>> CUSTOMER LIST <<<");
						customerRepository.findAll().forEach(c -> System.out.println("ID: " + c.getId() + " | Name: " + c.getName()));
					}
					case "4" -> {
						System.out.println("\n>>> ADD NEW JOB <<<");
						System.out.print("Enter Customer ID for this job: ");
						Long customerId = Long.parseLong(scanner.nextLine());

						customerRepository.findById(customerId).ifPresentOrElse(customer -> {
							Job job = new Job();
							job.setCustomer(customer);

							System.out.print("Total Budget Amount: ");
							job.setTotalBudgetAmount(Double.parseDouble(scanner.nextLine()));

							jobRepository.save(job);
							System.out.println("SUCCESS: Job created with ID: " + job.getId());
						}, () -> System.out.println("ERROR: Customer ID not found"));
					}
					case "5" -> {
						System.out.println("\n>>> JOB LIST <<<");
						jobRepository.findAll().forEach(c -> System.out.println("ID: " + c.getId() + " | Job Status: " + c.getJobStatus()));
					}

					case "6" -> {
						System.out.println("\n>>> RECORD MATERIAL USAGE <<<");
						System.out.print("Enter Job ID: ");
						Long jobId = Long.parseLong(scanner.nextLine());

						Optional<Job> jobOpt = jobRepository.findById(jobId);

						if (jobOpt.isPresent()) {
							MaterialUsage usage = new MaterialUsage();
							usage.setJob(jobOpt.get());

							System.out.println("Quantity of ISO: ");
							usage.setISOQuantity(Double.parseDouble(scanner.nextLine()));

							System.out.println("Quantity of Resina: ");
							usage.setResinaQuantity(Double.parseDouble(scanner.nextLine()));

							materialUsageRepository.save(usage);
							System.out.println("SUCCESS: Materials recorded for Job #" + jobId);

						} else {
							System.out.println("Error: Job ID not found.");
						}
					}
					case "7" -> {
						System.out.println("Shutting down... bye!");
						running = false;
					}
					default -> System.out.println("Invalid action. Please try again.");

				}
			}
		};
	}
}
