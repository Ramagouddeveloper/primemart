package com.primemart.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.primemart.entity.Product;
import com.primemart.record.ProductQuantity;

public interface ProductRepository extends JpaRepository<Product, Long> {

	List<Product> findByAdminId(Long adminId);

	List<Product> findByLocationIdOrderByIdDesc(Long locationId);
	boolean existsByNameAndLocationId(String name, Long locationId);
	
//	@Query("""
//		    SELECT new com.primemart.record.ProductQuantity(p.id, p.quantity)
//		    FROM Product p
//		    WHERE p.id IN :productids""")
//	List<ProductQuantity> findProductQuntityByProductIds(List<Long> productids);
}
