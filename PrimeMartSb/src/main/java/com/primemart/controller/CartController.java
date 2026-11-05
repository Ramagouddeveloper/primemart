package com.primemart.controller;


import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.primemart.entity.Cart;
import com.primemart.entity.CartItem;
import com.primemart.entity.Product;
import com.primemart.entity.User;
import com.primemart.repository.CartItemRepository;
import com.primemart.repository.CartRepository;
import com.primemart.repository.ProductRepository;
import com.primemart.repository.UserRepository;
import com.primemart.service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final CartService cartService;

    public CartController(UserRepository userRepo,
                          ProductRepository productRepo,
                          CartRepository cartRepo,
                          CartItemRepository cartItemRepo, CartService cartService) {
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public Map<String, Object> addToCart(@RequestBody Map<String, Object> req) {

        String username = (String) req.get("username");
        Long productId = Long.valueOf(req.get("productId").toString());
        int qty = Integer.parseInt(req.get("quantity").toString());

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = cartRepo.findByUser(user).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(user);
            return cartRepo.save(c);
        });

        CartItem item = cartItemRepo.findByCartAndProduct(cart, product)
                .orElse(null);

        if (qty <= 0) {
            if (item != null) {
                cartItemRepo.delete(item);
            }
            return Map.of("message", "Item removed");
        }

        if (item == null) {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setPrice(product.getPrice());
        }

        item.setQuantity(qty);
        cartItemRepo.save(item);

        return Map.of("message", "Cart updated");
    }

    @GetMapping("/items/{username}")
    public List<CartItem> getCartItems(@PathVariable String username) {

        return cartService.getCartItems(username);
    }
    
    
    
    @GetMapping("/count/{username}")
    public Map<String, Object> getCartCount(@PathVariable String username) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepo.findByUser(user)
                .orElse(null);

        if (cart == null) {
            return Map.of("count", 0);
        }

        List<CartItem> items = cartItemRepo.findByCart(cart);

        int total = items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        return Map.of("count", total);
    }
    
    
    @DeleteMapping("/clear/{username}")
    public Map<String, String> clearCart(@PathVariable String username) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepo.findByUser(user)
                .orElse(null);

        if (cart != null) {
            cartItemRepo.deleteAll(cartItemRepo.findByCart(cart));
        }

        return Map.of("message", "Cart cleared");
    }
    
}
