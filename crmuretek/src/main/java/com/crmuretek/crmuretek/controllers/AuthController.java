package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.dto.LoginRequestDTO;
import com.crmuretek.crmuretek.repositories.UserRepository;
import com.crmuretek.crmuretek.security.JwtUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private UserRepository userRepository;
    private JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil){ this.userRepository = userRepository; this.jwtUtil = jwtUtil; }

    @PostMapping
    public String login(@RequestBody LoginRequestDTO request){
        return "ok";
    }

}
