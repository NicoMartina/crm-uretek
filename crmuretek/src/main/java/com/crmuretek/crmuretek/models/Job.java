    package com.crmuretek.crmuretek.models;

    import com.fasterxml.jackson.annotation.JsonBackReference;
    import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import jakarta.persistence.*;
    import jakarta.validation.constraints.Min;
    import jakarta.validation.constraints.Positive;
    import lombok.Data;

    import java.time.LocalDate;
    import java.util.List;

    @Entity
    @Table(name = "jobs")
    @Data
    public class Job {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "lead_id")
        private Lead lead;

        @OneToOne
        @JoinColumn(name = "visit_id")
        private Visit visit;

        @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
        @JsonManagedReference("job-materials")
        private List<MaterialUsage> materialUsages;

        @Min(value = 0, message = "Material cannot be negative")
        private Double estimateMaterialKg; // estimation of kg to use in the job

        @Positive(message = "Price must be greater than 0")
        private Double pricePerKilo;


        // --- EXPENSE TRACKING ---
        private Double travelExpenses;   // Cost of gas/hotels for the crew
        private Double extraCosts;       // Any other expenses (rentals, etc.)


        private String quoteNumber; // numero de presupesto aceptado
        private Double totalAmount;    // monto del presupuesto aceptado


        // Down payment (anticipo)
        private Double downPaymentAmount;    // monto del anticipo (generalmente 50%)
        private String downPaymentMethod;   // metodo de pago del anticipo
        private LocalDate downPaymentAmountDate; // fecha de pago del anticipo

        private LocalDate workDate;   // fecha del trabajo

        @Enumerated(EnumType.STRING)
        private JobStatus jobStatus;     //status del trabajo

        //Final Balance (Saldo)
        private Double balanceAmount;  // monto del saldo a pagar
        private LocalDate balancePaymentDate;  // fecha de pago del saldo
        private String balancePaymentMethod;   // metodo de pago del saldo

        private String completionFormUrl; // formulario de fin de obra

        @Column(columnDefinition = "TEXT")
        private String observations;



        public void calculateTotals(){
            if (this.estimateMaterialKg != null &&  this.pricePerKilo != null) {
                this.totalAmount = this.estimateMaterialKg * this.pricePerKilo;
            } else {
                this.totalAmount = 0.0;
            }

            double downPayment = (this.downPaymentAmount != null) ? this.downPaymentAmount : 0.0;
            this.balanceAmount = this.totalAmount - downPayment;
        }

    }
