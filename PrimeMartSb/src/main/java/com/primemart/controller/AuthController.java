package com.primemart.controller;


import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.primemart.dto.LoginRequest;
import com.primemart.dto.RegisterRequest;
import com.primemart.entity.Role;
import com.primemart.entity.User;
import com.primemart.repository.UserRepository;
import com.primemart.security.JwtService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://192.168.2.9:4200")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepo, PasswordEncoder encoder, JwtService jwtService) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest request) {

        if (userRepo.existsByUsername(request.getUsername())) {
            return Map.of("message", "Username already exists");
        }

        if (userRepo.existsByEmail(request.getEmail())) {
            return Map.of("message", "Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);

        userRepo.save(user);


        return Map.of("message", "User registered successfully");
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {

        Optional<User> users = userRepo.findByUsername(request.getUsername());
        User user = users.get();
        		
//                .orElseThrow(() -> new RuntimeException("Invalid username"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
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
