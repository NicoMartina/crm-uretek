# Stage 1 - Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2 - Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html