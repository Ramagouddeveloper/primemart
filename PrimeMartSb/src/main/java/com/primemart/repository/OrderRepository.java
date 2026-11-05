package com.primemart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.primemart.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

	List<Order> findByUsername(String username);

}
