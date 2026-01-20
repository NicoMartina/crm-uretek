package com.crmuretek.crmuretek;

import com.crmuretek.crmuretek.models.*;
import com.crmuretek.crmuretek.repositories.*;
import com.crmuretek.crmuretek.services.VisitService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cglib.core.Local;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;

@SpringBootApplication
public class CrmuretekApplication {


	public static void main(String[] args) {
		SpringApplication.run(CrmuretekApplication.class, args);
	}

	private static double readDoubleSafely(Scanner scanner, String prompt){
		while (true) {
			try {
				System.out.println(prompt);
				return Double.parseDouble(scanner.nextLine());

			} catch (NumberFormatException e){
				System.out.println("Error: That is not a valid number. Please try again");
			}
		}
	}


	@Bean
	public CommandLineRunner demo(
			CustomerRepository customerRepository,
			VisitService visitService,
			JobRepository jobRepository,
			MaterialUsageRepository materialUsageRepository,
			ExpenseRepository expenseRepository) {
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
				System.out.println("7. [DATA] Update Customer Details");
				System.out.println("8. [DATA] Search for a customer");
				System.out.println("9. [EXIT] Search for Job");
				System.out.println("10. [DATA] Record Payment Method");
				System.out.println("11. [DATA] Business Health Summary");
				System.out.println("12. [EXIT] Exit");
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
						System.out.println("\n>>> ADD NEW CUSTOMER <<<");
						Customer c = new Customer();
						System.out.println("Enter Customer Name: ");
						String name = scanner.nextLine();
						c.setName(name);
						System.out.println("Enter Customer Email: ");
						String email = scanner.nextLine();
						c.setEmail(email);
						System.out.println("Enter Customer Phone Number: ");
						String number = scanner.nextLine();
						c.setPhoneNumber(number);
						System.out.println("Enter Customer Address: ");
						String address = scanner.nextLine();
						c.setAddress(address);
						System.out.println("Enter the Client's Issue: ");
						String issue = scanner.nextLine();
						c.setIssueDescription(issue);
						c.setContactDate(LocalDate.now());


						customerRepository.save(c);
						System.out.println("SUCCESS: " + c.getName() + " saved with full contact details.");
					}
					case "3" -> {

						System.out.println("\n>>> CUSTOMER LIST <<<");
						customerRepository.findAll().forEach(customer -> System.out.printf("| ID: %-4d | Name: %-20s | Email: %-25s | Address: %-30s |%n",
								customer.getId(),
								customer.getName(),
								customer.getEmail(),
								customer.getAddress()
						));

					}
					case "4" -> {
						System.out.println("\n>>> ADD NEW JOB <<<");
						System.out.print("Enter Customer ID for this job: ");
						Long customerId = Long.parseLong(scanner.nextLine());

						customerRepository.findById(customerId).ifPresentOrElse(customer -> {
							Job job = new Job();
							job.setCustomer(customer);

							System.out.print("Total Budget Amount: ");
							job.setTotalBudgetAmount(readDoubleSafely(scanner, "Total Budget Amount: $"));

							System.out.println("Estimated Material (kg): ");
							job.setEstimateMaterialKg(readDoubleSafely(scanner, "Estimated Material (kg): "));

							System.out.println("Enter status (LEAD, QUOTED, IN_PROGRESS, PAID, ETC): ");
							String statusInput = scanner.nextLine().toUpperCase().trim();


							job.setJobStatus(JobStatus.valueOf(statusInput));


							jobRepository.save(job);
							System.out.println("SUCCESS: Job created with ID: " + job.getId());
						}, () -> System.out.println("ERROR: Customer ID not found"));
					}
					case "5" -> {
						System.out.println("\n>>> JOB LIST <<<");
						jobRepository.findAll().forEach(j -> {
							try {
								// 1. Calculate the Total used so far
								double totalActual = j.getMaterialUsages().stream()
										.mapToDouble(m -> (m.getISOQuantity() != null ?  m.getISOQuantity() : 0.0)
												+ (m.getResinQuantity() != null ? m.getResinQuantity() : 0.0))
										.sum();

								// 2. Safely Calculating the Estimate and  "Gap" (Difference)
								Double estimateValue = j.getEstimateMaterialKg();
								double estimate = (estimateValue != null) ?  estimateValue : 0.0;
								double gap = estimate - totalActual;

								// 3. Safe Strings
								String name = (j.getCustomer() != null ? j.getCustomer().getName() : "Unknown");
								String address = (j.getCustomer() != null && j.getCustomer().getAddress() != null ? j.getCustomer().getAddress() : "No Address");
								String status = (j.getJobStatus() != null ? j.getJobStatus().name() : "PENDING");


								// 4. The Final Print
								System.out.printf("| ID: %-3d | Client: %-15s | Status: %-10s| Budget: $%-9.2f | Est: %6.1fkg | Act: %6.1fkg | Diff: %6.1fkg |%n",
										j.getId(),
										name,
										status,
										(j.getTotalBudgetAmount() != null ? j.getTotalBudgetAmount() : 0.0),
										estimate,
										totalActual,
										gap
								);

							} catch (Exception e) {
								System.out.println("Error printing  Job ID " + j.getId() + ": " + e.getMessage());
							}
						});
					}

					case "6" -> {
						try{
							System.out.println("\n>>> SELECT A JOB TO RECORD MATERIALS <<<");

							// 1. SHOW THE JOBS FIRST (The "Menu")
							jobRepository.findAll().forEach(j -> System.out.printf(
									"JOB ID: %-4d | Client: %-15s | Status: %-10s%n",
									j.getId(),
									j.getCustomer().getName(),
									j.getJobStatus()
							));

							// 2. NOW ASK FOR THE ID
							System.out.println("\nEnter Job ID: ");
							Long jobId = Long.parseLong(scanner.nextLine());

							jobRepository.findById(jobId).ifPresentOrElse(job -> {
								double totalKg = readDoubleSafely(scanner, "How many total Kg were used on this job? ");

								// Calculate the ratio
								double isoPortion = totalKg * .63;
								double resinPortion = totalKg * .37;

								// Create the record
								MaterialUsage usage = new MaterialUsage();
								usage.setJob(job);
								usage.setISOQuantity(isoPortion);
								usage.setResinQuantity(resinPortion);
								usage.setUsageDate(LocalDate.now());

								materialUsageRepository.save(usage);
								System.out.println("-----------------------------------------");
								System.out.println("SUCCESS: Materials Recorded");
								System.out.printf("TOTAL KG: %.1f kg%n", totalKg);
								System.out.printf("ISO:      %.1f kg%n", isoPortion);
								System.out.printf("RESINA:   %.1f kg%n", resinPortion);
								System.out.println("-----------------------------------------");

							}, () -> System.out.println("(!) Error: Job ID not  found."));
						} catch (Exception e){
							System.out.println("Error" + e.getMessage());
						}



					}

					case "7" -> {
						System.out.println("\n>>> UPDATE CUSTOMER DETAILS <<<");
						System.out.print("Enter the ID of the customer to update: ");
						Long id = Long.parseLong(scanner.nextLine());

						// 1. Find existing customer
						customerRepository.findById(id).ifPresentOrElse(existingCustomer -> {
							System.out.println("Current details: " + existingCustomer.getName() +
									" | " + existingCustomer.getEmail() +
									" | " + existingCustomer.getPhoneNumber() +
									" | " + existingCustomer.getAddress() +
									" | " + existingCustomer.getIssueDescription());

							// 2. Ask for new details
							System.out.println("Enter new name (leave blank to keep existing one)");
							String name = scanner.nextLine();
							if (!name.isBlank()) existingCustomer.setName(name);

							System.out.println("Enter new email (leave blank to keep existing one)");
							String email = scanner.nextLine();
							if (!email.isBlank()) existingCustomer.setEmail(email);

							System.out.println("Enter new Number (leave blank to keep existing one)");
							String number = scanner.nextLine();
							if (!number.isBlank()) existingCustomer.setPhoneNumber(number);

							System.out.println("Enter new Address (leave blank to keep existing one)");
							String address = scanner.nextLine();
							if (!address.isBlank()) existingCustomer.setAddress(address);

							System.out.println("Change issue description (leave blank to keep existing one)");
							String issue = scanner.nextLine();
							if (!issue.isBlank()) existingCustomer.setIssueDescription(issue);

							customerRepository.save(existingCustomer);
							System.out.println("SUCCESS: Customer #" + id + " has been updated.");
						}, () -> System.out.println("ERROR: Customer ID not found"));
					}

					case "8" -> {
						System.out.println("\n>>> SEARCH CUSTOMER <<<");
						System.out.print("Enter name to search: ");
						String name = scanner.nextLine();

						// We use a custom search logic  here
						List<Customer> results = customerRepository.findAll().stream()
								.filter(c -> c.getName()
										.toLowerCase()
										.contains(name.toLowerCase()))
								.toList();

						if (results.isEmpty()){
							System.out.println("No customers found matching: " + name);
						} else {
							results.forEach(c -> System.out.println("ID: " + c.getId() + " | Name: " + c.getName()));
						}
					}

					case "9" -> {
						try{
							System.out.println("\n>>> JOB INSPECTOR <<<");
							System.out.println("Enter job ID to view full history: ");
							Long jobId = Long.parseLong(scanner.nextLine());

							jobRepository.findById(jobId).ifPresentOrElse(j -> {
								System.out.println("========================================");
								System.out.printf("DETAILS FOR JOB ID #%d%n", j.getId());
								System.out.println("========================================");
								System.out.println("CLIENT: 		   " + j.getCustomer().getName());
								System.out.println("STATUS: 		   " + j.getJobStatus());
								System.out.println("SITE ADDRESS:	   " + j.getCustomer().getAddress());
								System.out.printf("TOTAL BUDGET: 	   $%.2f%n", j.getTotalBudgetAmount());
								System.out.printf("ESTIMATED MATERIAL: %.1f kg%n", j.getEstimateMaterialKg());

								System.out.println("\n--- MATERIAL LOG ---");
								if (j.getMaterialUsages().isEmpty()) {
									System.out.println("No materials recorded for this job");
								} else {
									// breakdown of every visit
									j.getMaterialUsages().forEach( m -> {
										System.out.printf(">> ISO: %5.1f kg | Resina: %5.1f kg%n",
												m.getISOQuantity(), m.getResinQuantity());
									});

									// the math summary
									double estimate = (j.getEstimateMaterialKg()!= null ? j.getEstimateMaterialKg() : 0.0);

									double totalUsed = j.getMaterialUsages().stream()
											.mapToDouble(m -> (m.getISOQuantity() != null ? m.getISOQuantity() : 0.0) + (m.getResinQuantity() != null ? m.getResinQuantity() : 0.0))
											.sum();

									double remaining = estimate - totalUsed;
									System.out.println("--------------------");
									System.out.printf("TOTAL USED: %.1f kg%n", totalUsed);
									System.out.printf("REMAINING: %.1f kg%n", remaining);
								}
								System.out.println("========================================\n");
							}, () -> System.out.println("(!) Error: Job ID " + jobId + " not found."));

						} catch (Exception e) {
							System.out.println("(!) Error Inspector: " + e.getMessage());
						}
					}
					case "10" -> {
						System.out.println("Enter job ID to record payment: ");
						Long id = Long.parseLong(scanner.nextLine());

						jobRepository.findById(id).ifPresentOrElse(job -> {
							System.out.println("1. Record Down Payment");
							System.out.println("2. Record Balance Payment");
							String choice = scanner.nextLine();

							if (choice.equals("1")) {
								job.setDownPaymentAmount(readDoubleSafely(scanner, "Enter Down Payment: "));
								job.setDownPaymentAmountDate(LocalDate.now());
								System.out.println("Payment Method  (Cash, Transfer, etc.): ");
								job.setDownPaymentMethod(scanner.nextLine());
							} else if ( choice.equals("2")) {
								job.setBalanceAmount(readDoubleSafely(scanner, "Enter Balance Payment: "));
								job.setBalancePaymentDate(LocalDate.now());
								System.out.println("Payment Method (Cash, Transfer, etc.): ");
								job.setBalancePaymentMethod(scanner.nextLine());
							}
							jobRepository.save(job);
							System.out.println("SUCCESS: Payment Recorded.");
						}, () -> System.out.println("Error: Job ID was not found."));
					}
					case "11" -> {
						// total income + all balances
						double totalIncome = jobRepository.findAll().stream()
								.mapToDouble( job -> (job.getDownPaymentAmount() != null ? job.getDownPaymentAmount() : 0.0)
								                        + (job.getBalanceAmount() != null ? job.getBalanceAmount() : 0.0))
								.sum();

						double totalExpenses = expenseRepository.findAll().stream()
								.mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
								.sum();

						System.out.println("\n========== BUSINESS HEALTH REPORT ============");
						System.out.printf("TOTAL REVENUE: (paid):  $%.2f%n", totalIncome);
						System.out.printf("TOTAL EXPENSES:         $%.2f%n", totalExpenses);
						System.out.println("--------------------------------------------------");
						System.out.printf("NET PROFIT:             $%.2f%n", (totalIncome - totalExpenses));
						System.out.println("==================================================\n");
					}

					case "12" -> {
						System.out.println("Shutting down... bye!");
						running = false;
					}
					default -> System.out.println("Invalid action. Please try again.");

				}
			}
		};
	}
}
