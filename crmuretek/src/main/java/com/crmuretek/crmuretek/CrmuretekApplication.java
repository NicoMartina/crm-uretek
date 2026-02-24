package com.crmuretek.crmuretek;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class CrmuretekApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrmuretekApplication.class, args);
	}

	// This tells the backend to allow requests from your React Frontend
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/api/**")
						.allowedOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost", "https://steadfast-liberation-production-c7c3.up.railway.app") // Your Vite React port
						.allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
						.allowedHeaders("*");
			}
		};
	}
}