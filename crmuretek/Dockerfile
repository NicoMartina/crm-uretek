# Stage 1 - Build
#Version of maven to create project
FROM maven:3.9.6-eclipse-temurin-21 AS builder
# the directory create to containerize
WORKDIR /crmuretek
# idk
COPY . .
# create the container
RUN ./mvnw -Dmaven.test.skip=true clean package

# Stage 2 - Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /crmuretek
COPY --from=builder /crmuretek/target/*.jar crmuretek.jar
ENTRYPOINT ["java", "-jar", "crmuretek.jar"]