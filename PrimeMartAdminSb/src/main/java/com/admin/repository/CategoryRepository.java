package com.admin.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.admin.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);
    
    Optional<Category> findByNameAndAdminId(String name, Long adminId);

    List<Category> findByAdminId(Long adminId);

    List<Category> findByLocationId(Long locationId);
    

}
