package com.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.admin.entity.Category;
import com.admin.entity.User;
import com.admin.repository.CategoryRepository;
import com.admin.repository.UserRepository;

@RestController
@RequestMapping("/admin/categories")
public class AdminCategoryController {

    private final CategoryRepository categoryRepo;
    private final UserRepository userRepo;

    public AdminCategoryController(CategoryRepository categoryRepo,
                                   UserRepository userRepo) {
        this.categoryRepo = categoryRepo;
        this.userRepo = userRepo;
    }

   
    @PostMapping
    public Map<String, Object> addCategory(
            @RequestBody Map<String, String> body,
            @RequestParam(required = false) Long adminId) {

        String name = body.get("name");

        if (name == null || name.trim().isEmpty()) {
            return Map.of("message", "Category name required");
        }

        if (adminId == null) {
            return Map.of("message", "Admin ID missing ❌");
        }

        if (categoryRepo.findByNameAndAdminId(name, adminId).isPresent()) {
            return Map.of("message", "Category already exists");
        }

        User admin = userRepo.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Category c = new Category();
        c.setName(name);
        c.setAdminId(adminId);
        c.setLocationId(admin.getLocationId());

        categoryRepo.save(c);

        return Map.of("message", "Category added successfully ✅");
    }

    
    @GetMapping("/admin/{adminId}")
    public List<Category> getAdminCategories(@PathVariable Long adminId) {
        return categoryRepo.findByAdminId(adminId);
    }

    
    @GetMapping("/location/{locationId}")
    public List<Category> getByLocation(@PathVariable Long locationId) {
        return categoryRepo.findByLocationId(locationId);
    }

  
    @GetMapping("/all")
    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }
}