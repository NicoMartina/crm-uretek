    package com.crmuretek.crmuretek.models;

    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import jakarta.persistence.*;
    import jakarta.validation.constraints.Min;
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
        @JoinColumn(name = "leads_id")
        private Consulta consulta;

        @OneToOne
        @JoinColumn(name = "visit_id")
        private Visit visit;

        @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
        @JsonManagedReference("job-materials")
        private List<MaterialUsage> materialUsages;

        @Min(value = 0, message = "Material cannot be negative")
        private Double estimateMaterialKg; // estimation of kg to use in the job

        private String quoteNumber; // numero de presupesto aceptado


        @Column(columnDefinition = "TEXT")
        private String observations;

        @Enumerated(EnumType.STRING)
        private JobStatus jobStatus;     //status del trabajo
        private LocalDate workDate;   // fecha del trabajo



    }
