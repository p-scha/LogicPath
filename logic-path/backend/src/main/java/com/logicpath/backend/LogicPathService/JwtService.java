package com.logicpath.backend.LogicPathService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    // 256-bit Base64 encoded key
    private static final String SECRET = "VGhpcy1pcy1hLXN1cGVyLXNlY3VyZS1sb25nLXNlY3JldC1rZXktZm9yLUhTMjU2LWFuZC1KV1RfMTIzNDU2Nzg5";

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
