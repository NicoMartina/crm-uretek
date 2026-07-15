package com.crmuretek.crmuretek.controllers;

import com.crmuretek.crmuretek.dto.LoginRequestDTO;
import com.crmuretek.crmuretek.models.User;
import com.crmuretek.crmuretek.repositories.UserRepository;
import com.crmuretek.crmuretek.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private UserRepository userRepository;
    private JwtUtil jwtUtil;
    final private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil){ this.userRepository = userRepository; this.jwtUtil = jwtUtil; }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO request){
        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());


        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).build();

        }

        User user = optionalUser.get();
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!passwordMatches){
            return ResponseEntity.status(401).build();

        } else {
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok().body(token);
        }

    }

}
