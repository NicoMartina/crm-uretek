# Stage 1 - Build
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /crmuretek
COPY . .
RUN ./mvnw -Dmaven.test.skip=true clean package

# Stage 2 - Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /crmuretek
COPY --from=builder /crmuretek/target/*.jar crmuretek.jar
ENTRYPOINT ["java", "-jar", "crmuretek.jar"]