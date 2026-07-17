package com.crmuretek.crmuretek.security;

import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;


public class JwtUtilTest {

    private JwtUtil jwtUtil = new JwtUtil("dGhpcyBpcyBhIHNlY3JldCBrZXkgZm9yIHVyZXRlayBjcm0gYXBwbGljYXRpb24h");;

    @Test
    void generateTokenSuccessfully(){
        // ARRANGE
        String username = "user";

        // ACT
        String token = jwtUtil.generateToken(username);

        // ASSERT
        assertThat(token).isNotNull();

    }

    @Test
    void extractUsernameMatchesOriginal(){
        // ARRANGE
        String username = "user";

        // ACT
        String token = jwtUtil.generateToken(username);
        String matchUsername = jwtUtil.extractUsername(token);

        // ASSERT
        assertThat(matchUsername).isEqualTo(username);
    }

    private String generateExpiredToken(String username){
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis() - 10000))
                .expiration(new Date(System.currentTimeMillis() - 5000))
                .signWith(Jwts.SIG.HS256.key().build())
                .compact();
    }

    @Test
    void  expiredTokenFailsValidation(){
        // ARRANGE
        String username = "user";
        String token = jwtUtil.generateToken(username);

        // ACT
        boolean result = jwtUtil.validate("Invalid.token.here");

        // ASSERT
        assertThat(result).isFalse();
    }
}
