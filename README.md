# CRM Uretek

A full-stack Customer Relationship Management (CRM) system built with Java and Spring Boot to replace spreadsheet-based workflows with a structured, scalable backend architecture.

This project was developed to migrate operational data from Google Sheets into a relational database system while improving data integrity, maintainability, and performance.

---

## 🚀 Overview

CRM Uretek is a business-oriented CRM application designed to:

- Manage customers and related business entities
- Provide RESTful APIs for frontend consumption
- Persist structured data in PostgreSQL
- Replace manual spreadsheet workflows with a backend service architecture

The focus of this project is backend design, clean layering, and real-world business logic implementation.

---

## 🏗 Architecture

The application follows a layered architecture:

Controller Layer → Service Layer → Repository Layer → Database

### 🔹 Controller Layer
- Handles incoming HTTP requests
- Converts JSON payloads into Java objects
- Returns HTTP responses to the client

### 🔹 Service Layer
- Contains business logic
- Processes application rules
- Coordinates between controller and repository
- Ensures correct operations are performed before accessing the database

Example:
If the frontend sends a request like `2 + 2`,  
the controller maps the JSON request →  
the service performs the logic (the addition) →  
the repository handles persistence (if needed) →  
the result flows back through the controller to the client.

### 🔹 Repository Layer
- Uses Spring Data JPA
- Abstracts database communication
- Eliminates boilerplate SQL code

---

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot 3
- Spring Web (REST APIs)
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven

### Frontend
(Specify your framework here: React / Next.js / etc.)

### Database
- PostgreSQL
- ORM handled via JPA/Hibernate

---

## 📦 Features

- CRUD operations for core entities
- RESTful API design
- Layered service architecture
- Input validation
- Structured error handling
- Database migration from spreadsheet workflow
- Environment-based configuration

---

## 🔌 API Endpoints (Example)
GET /api/customers
GET /api/customers/{id}
POST /api/customers
PUT /api/customers/{id}
DELETE /api/customers/{id}

Standard HTTP response codes are used:
- 200 OK
- 201 Created
- 400 Bad Request
- 404 Not Found

---

## 🧠 Key Technical Concepts

### ✅ JPA (Java Persistence API)

JPA simplifies database communication by removing boilerplate JDBC code.

Instead of manually writing SQL and managing connections, entities are mapped as Java classes and Hibernate handles:

- SQL generation
- Object-relational mapping
- Entity state management

This allows focus on business logic rather than low-level database handling.

---

### ✅ @Transactional

`@Transactional` ensures atomic operations.

If multiple database operations occur inside a method:
- Either all operations succeed
- Or all operations fail and rollback

This guarantees data consistency and prevents partial updates.

---

## ▶️ Running the Project

### Prerequisites

- Java 17+
- Maven
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/NicoMartina/crm-uretek.git
cd crm-uretek
```

### 2. Create PostgreSQL database
- CREATE DATABASE crm_uretek;

### 3. Configure application.properties
- spring.datasource.url=jdbc:postgresql://localhost:5432/crm_uretek
- spring.datasource.username=your_username
- spring.datasource.password=your_password
  
### 4. Run the application
- mvn spring-boot:run
- Server runs at:
- http://localhost:8080

  
### 📈 Future Improvements
- Add Spring Security + JWT authentication
- Add unit and integration tests
- Add Docker support
- Add Swagger/OpenAPI documentation
- Deploy to AWS / Railway / Render
- CI/CD pipeline integration

  
### 👨‍💻 Author
- Nico Martina
- Computer Science Graduate
- Backend-focused Software Developer

  
### 🎯 Project Purpose

This project demonstrates:
- Backend system design using Spring Boot
- Clean separation of concerns
- Database modeling with JPA/Hibernate
- Transaction management
- RESTful API development
- Migration from spreadsheet-based operations to structured backend architecture
- It reflects practical, real-world software engineering experience.

---




