package com.logicpath.backend.LogicPathController;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.logicpath.backend.LogicPathModel.User;
import com.logicpath.backend.LogicPathReposatory.UserRepository;
import com.logicpath.backend.LogicPathService.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of(
            "token", "dev-token",
            "user", Map.of(
                "username", body.get("username")
            )
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok("DEV MODE: registration disabled");
    }
}
