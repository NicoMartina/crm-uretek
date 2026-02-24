# Stage 1 - Build
FROM node:20-alpine AS builder
WORKDIR /crmuretek-frontend
COPY . .
RUN npm install
RUN npm run build

# Stage 2 - Run
FROM nginx:alpine
COPY --from=builder /crmuretek-frontend/dist usr/share/nginx/html
