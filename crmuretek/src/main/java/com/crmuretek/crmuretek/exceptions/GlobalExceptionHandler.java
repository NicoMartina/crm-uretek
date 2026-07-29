package com.crmuretek.crmuretek.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 1. Specifically handle "Not Found" cases
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleNotFound(ResourceNotFoundException exception){
        return buildResponse(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    // 2. Specifically handle  "Business Logic"  failures  (like no material)
    @ExceptionHandler(InsufficientMaterialException.class)
    public ResponseEntity<Object> handleBusinessError(InsufficientMaterialException exception){
        return buildResponse(exception.getMessage(), HttpStatus.CONFLICT);
    }

    // 3. Fallback for everything  else (The "safety net")
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralError(Exception exception){
        exception.printStackTrace();
        return buildResponse("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<Object> handleInputError(InvalidInputException exception){
        return buildResponse(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<Object> buildResponse(String message, HttpStatus status){
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", message);
        body.put("status", status.value());
        return new ResponseEntity<>(body, status);
    }
}
