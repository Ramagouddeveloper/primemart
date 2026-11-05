package com.primemart.repository;


import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.primemart.entity.Cart;
import com.primemart.entity.User;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
