

package com.primemart.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.primemart.entity.Category;
import com.primemart.entity.Product;
import com.primemart.repository.CategoryRepository;
import com.primemart.repository.ProductRepository;

@RestController
@RequestMapping("/practice/products")
public class ProductController {

    private final CategoryRepository categoryRepo;
    private final ProductRepository productRepo;

    public ProductController(CategoryRepository categoryRepo,
                             ProductRepository productRepo) {
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
    }

   
    @GetMapping("/fetchcategories")
    public List<Category> fetchCategories() {
        return categoryRepo.findAll();
    }

    @GetMapping("/fetchproducts")
    public List<Product> fetchProducts(@RequestParam Long locationId) {
        return productRepo.findByLocationIdOrderByIdDesc(locationId);
    }
}