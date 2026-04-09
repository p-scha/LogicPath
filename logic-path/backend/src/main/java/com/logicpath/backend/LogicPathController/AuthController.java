package com.logicpath.backend.LogicPathController;

import com.logicpath.backend.LogicPathModel.User;
import com.logicpath.backend.LogicPathReposatory.UserRepository;
import com.logicpath.backend.LogicPathService.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    JwtService jwtService;

@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody User user) {
    if (userRepository.findByUsername(user.getUsername()).isPresent()) {
        return ResponseEntity.badRequest().body("Username already exists");
    }

    user.setPassword(passwordEncoder.encode(user.getPassword()));
    userRepository.save(user);

    return ResponseEntity.ok("User registered");
}

   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User loginRequest) {

    User user = userRepository.findByUsername(loginRequest.getUsername())
            .orElse(null);

    if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
        return ResponseEntity.status(401).body("Invalid username or password");
    }

    String token = jwtService.generateToken(user.getUsername());

    return ResponseEntity.ok(Map.of("token", token));
    }
}
