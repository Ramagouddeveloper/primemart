package com.primemart.config;

import java.util.*;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.primemart.entity.Category;
import com.primemart.entity.DeliverableLocation;
import com.primemart.entity.Product;
import com.primemart.repository.CategoryRepository;
import com.primemart.repository.DeliverableLocationRepository;
import com.primemart.repository.ProductRepository;

@Configuration
public class SampleDataInitializer {

    @Bean
    CommandLineRunner seed(
            DeliverableLocationRepository locRepo,
            CategoryRepository catRepo,
            ProductRepository productRepo) {

        return args -> {

            // 1. Create locations if they do not exist
            List<DeliverableLocation> locs = locRepo.findAll();

            if (locs.isEmpty()) {

                String[][] data = {
                        {"Hyderabad", "500010"},
                        {"Bangalore", "560001"},
                        {"Chennai", "600001"}
                };

                for (String[] d : data) {

                    DeliverableLocation location = new DeliverableLocation();

                    location.setCity(d[0]);
                    location.setPincode(d[1]);
                    location.setState("India");
                    location.setFullAddress(d[0] + ", India");
                    location.setActive(true);

                    locRepo.save(location);
                }

                locs = locRepo.findAll();
            }

            // 2. Create categories only ONCE
            Map<String, Category> categories = new HashMap<>();

            String[] categoryNames = {
                    "Grocery",
                    "Home Care",
                    "Personal Care",
                    "Snacks & Beverages"
            };

            for (String name : categoryNames) {

                Optional<Category> existingCategory =
                        catRepo.findByName(name);

                Category category;

                if (existingCategory.isPresent()) {
                    category = existingCategory.get();
                } else {

                    category = new Category();

                    category.setName(name);

                    // Category is global, not location specific
                    category.setLocationId(null);
                    category.setAdminId(null);

                    category = catRepo.save(category);
                }

                categories.put(name, category);
            }

            // 3. Sample products
            String[] names = {
                    "Fresh Basmati Rice 5kg",
                    "Aashirvaad Atta 5kg",
                    "Fortune Sunflower Oil 1L",
                    "Tata Salt 1kg",
                    "Amul Taaza Milk 1L",
                    "Britannia Good Day Biscuits",
                    "Tata Tea Premium 500g",
                    "Surf Excel Matic 2kg",
                    "Colgate Strong Teeth 200g",
                    "Dove Bathing Bar Pack",
                    "Parle-G Biscuits",
                    "Dettol Liquid 500ml"
            };

            double[] prices = {
                    549,
                    299,
                    149,
                    28,
                    68,
                    60,
                    245,
                    299,
                    120,
                    180,
                    30,
                    165
            };

            String[] productCategories = {
                    "Grocery",
                    "Grocery",
                    "Grocery",
                    "Grocery",

                    "Grocery",
                    "Snacks & Beverages",
                    "Snacks & Beverages",
                    "Home Care",

                    "Personal Care",
                    "Personal Care",
                    "Snacks & Beverages",
                    "Personal Care"
            };

            // 4. Create products for each location
            for (DeliverableLocation location : locs) {

                for (int i = 0; i < names.length; i++) {

                    // Don't create duplicate product for same location
                    if (productRepo.existsByNameAndLocationId(
                            names[i],
                            location.getId())) {

                        continue;
                    }

                    Category category =
                            categories.get(productCategories[i]);

                    Product product = new Product();

                    product.setName(names[i]);
                    product.setQuantity(20 + (i % 5) * 5);

                    product.setActualPrice(prices[i] + 20);
                    product.setPrice(prices[i]);

                    product.setCategory(category);

                    // Product belongs to this location
                    product.setLocationId(location.getId());

                    product.setAdminId(null);

                    productRepo.save(product);
                }
            }
        };
    }

    private String categoryName(int i) {

        return switch (i) {
            case 0 -> "Grocery";
            case 1 -> "Home Care";
            case 2 -> "Personal Care";
            default -> "Snacks & Beverages";
        };
    }
}