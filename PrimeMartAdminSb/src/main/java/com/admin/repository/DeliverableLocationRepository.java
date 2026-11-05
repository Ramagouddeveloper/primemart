package com.admin.repository;


import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.admin.entity.DeliverableLocation;

public interface DeliverableLocationRepository 
        extends JpaRepository<DeliverableLocation, Long> {

    List<DeliverableLocation> findByActiveTrue();

    List<DeliverableLocation> findByPincodeAndActiveTrue(String pincode);
}