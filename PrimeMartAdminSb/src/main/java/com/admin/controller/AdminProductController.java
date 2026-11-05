package com.admin.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.admin.entity.Category;
import com.admin.entity.Product;
import com.admin.entity.User;
import com.admin.repository.CategoryRepository;
import com.admin.repository.ProductRepository;
import com.admin.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final UserRepository userRepo;

    public AdminProductController(ProductRepository productRepo,
                                  CategoryRepository categoryRepo,
                                  UserRepository userRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.userRepo = userRepo;
    }

   
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product addProduct(
            @RequestParam String name,
            @RequestParam int quantity,
            @RequestParam double actualPrice,
            @RequestParam double price,
            @RequestParam Long categoryId,
            @RequestParam Long adminId,  
            @RequestParam MultipartFile image
    ) throws Exception {

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        User admin = userRepo.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Product p = new Product();
        p.setName(name);
        p.setQuantity(quantity);     // stock
        p.setActualPrice(actualPrice);
        p.setPrice(price);
        p.setCategory(category);
        p.setImage(image.getBytes());

        p.setAdminId(adminId);
        p.setLocationId(admin.getLocationId());

        return productRepo.save(p);
    }

   
    @GetMapping
    public List<Product> getAdminProducts(@RequestParam Long adminId) {
        return productRepo.findByAdminId(adminId);
    }

  
    @PutMapping("/{productId}/stock")
    public Product updateStock(@PathVariable Long productId,
                               @RequestParam int quantity) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setQuantity(quantity);

        return productRepo.save(product);
    }

    
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productRepo.deleteById(id);
        return "Product deleted successfully";
    }
}