# CRM Uretek - Dev Notes



**Start new work:**
* git checkout main
* git pull origin main
* git checkout -b feat/TICKET-NUMBER-description
* git push origin feat/TICKET-NUMBER-description

-------

**During work — commit as you go**
* git add .
* git commit -m "type: description"
* git push origin feat/TICKET-NUMBER-description

-------
**When done**

→ Open PR on GitHub.

→ Merge PR on GitHub.

→ Delete branch on GitHub

------
**Back locally**
* git checkout main
* git pull origin main

------

## Docker

Packages your app and everything it needs into a container so it runs the same everywhere. No more "works on my machine."

### Key Files
## Dockerfile (Backend)
### Stage 1 - Build
1. Download Maven with Java 21 as the base image for building:
    * FROM maven:3.9.6-eclipse-temurin-21 AS builder

2. Set /crmuretek as the working directory inside the container
   * WORKDIR /crmuretek

3. Copy everything from my local project folder into the container
   * COPY . .

4. Build the project into a JAR file, skipping tests
   * RUN ./mvnw -Dmaven.test.skip=true clean package

### Stage 2 - Run
    
1. Use a lightweight Java runtime (no Maven needed anymore)
    * FROM eclipse-temurin:21-jre-alpine

2. Set working directory for the runtime container
   * WORKDIR /crmuretek

3. Copy only the JAR from Stage 1 into this smaller container
   * COPY --from=builder /crmuretek/target/*.jar crmuretek.jar

4. Command to run when the container starts 
   * ENTRYPOINT ["java", "-jar", "crmuretek.jar"]

## Dockerfile (Frontend)
### Stage 1 - Build

1. Download Node 20 as the base image for building
   * FROM node:20-alpine AS builder

2. Set /app as the working directory inside the container
   * WORKDIR /app

3. Copy everything from my local project folder into the container
   * COPY . .
4. Install all npm dependencies
   * RUN npm install
5. Declare a build argument so Railway can pass VITE_API_URL during build
   * ARG VITE_API_URL

6. Set it as an environment variable so Vite can read it during build
   * ENV VITE_API_URL=$VITE_API_URL

7. Build the React app into static files in the /dist folder
   * RUN npm run build

### Stage 2 - Serve

1. Use lightweight Nginx to serve the static files
   * FROM nginx:alpine

2. Copy the built /dist folder from Stage 1 into Nginx's serving directory
   * COPY --from=builder /app/dist /usr/share/nginx/html
------

### Copy the built /dist folder from Stage 1 into Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

--------

#### docker-compose.yml
```
services:
###### Service 1 - Database
db:
image: postgres:16  # Download official Postgres image, no Dockerfile needed
environment:
POSTGRES_DB: family_business_crm  # Database name
POSTGRES_USER: postgres           # Database user
POSTGRES_PASSWORD: ${DB_PASSWORD} # Password from .env file
ports:
- "5432:5432"  # left = your machine, right = inside container
volumes:
- postgres_data:/var/lib/postgresql/data  # Persist data so it survives container restarts

# Service 2 - Backend
backend:
build: ./crmuretek  # Build using the Dockerfile in this folder
ports:
- "8080:8080"
environment:
DB_HOST: db        # Use service name "db" not localhost
DB_USER: postgres
DB_PASSWORD: ${DB_PASSWORD}
depends_on:
- db  # Don't start until database is running

# Service 3 - Frontend
frontend:
build: ./crmuretek-frontend  # Build using the Dockerfile in this folder
ports:
- "80:80"  # Nginx serves on port 80
depends_on:
- backend  # Don't start until backend is running

volumes:
postgres_data:  # Named volume that persists database data on your machine

### Key Commands
* docker compose up          # start everything
* docker compose up --build  # rebuild and start
* docker compose down        # stop everything
* docker build -t name .     # build a single image
```

### Two Stage Build Pattern
* Stage 1 — build the app (needs heavy tools like Maven or Node)
* Stage 2 — run the app (only needs Java or Nginx, keeps image small)

---------
## Railway

### What is Railway?
[explain in your own words]

### Deployment Setup
1. Create a Project 
2. Create A database service, in this case postgreSQL and connect it to your GitHub.
3. Create a backend service and connect it to the backend repo from your GitHub repo.
4. Create a frontend service and connect it to your frontend repo from your Github repo.
5. Create 3 variables for the backend service:
    * SPRING_DATASOURCE_PASSWORD
    * SPRING_DATASOURCE_URL
    * SPRING_DATASOURCE_USERNAME 
6. Create 1 variable in the forntend service contaning the backend service link:
    * VITE_API_URL
7. In your frontend Dockerfile add this:
    * RUN npm install
    * ARG VITE_API_URL
    * ENV VITE_API_URL=$VITE_API_URL
    * RUN npm run build

### Key Concepts
[environment variables, root directory, VITE_API_URL at build time]

### Deployment Flow
[explain what happens when you push code]eps image small)