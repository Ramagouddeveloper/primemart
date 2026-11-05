package com.admin.controller;

import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.admin.dto.LoginRequest;
import com.admin.entity.User;
import com.admin.repository.UserRepository;
import com.admin.security.JwtService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepo,
                          PasswordEncoder encoder,
                          JwtService jwtService) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username/password"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username/password");
        }

        if (user.getRole() == null ||
                !(user.getRole().name().equals("ADMIN") || user.getRole().name().equals("SUPER_ADMIN"))) {
            throw new RuntimeException("Only admin users can login here");
        }

        String token = jwtService.generateToken(user.getUsername());

        return Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", user.getRole(),
                "userId", user.getId()
        );
    }
}
