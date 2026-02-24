# Stage 1 - Build
#Download Node
FROM node:20-alpine AS builder
#Set /app as the working directory inside the container
WORKDIR /app
#Copy everything from my local project folder into the container
COPY . .
#Build the project into a JAR file, skipping tests
RUN npm install
#idk
ARG VITE_API_URL
#idk
ENV VITE_API_URL=$VITE_API_URL
#build the container
RUN npm run build

# Stage 2 - Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html