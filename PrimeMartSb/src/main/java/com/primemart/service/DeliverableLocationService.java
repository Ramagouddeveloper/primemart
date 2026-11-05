package com.primemart.service;


import java.util.List;
import org.springframework.stereotype.Service;
import com.primemart.entity.DeliverableLocation;
import com.primemart.repository.DeliverableLocationRepository;

@Service
public class DeliverableLocationService {

    private final DeliverableLocationRepository repo;

    public DeliverableLocationService(DeliverableLocationRepository repo) {
        this.repo = repo;
    }

    public DeliverableLocation addLocation(DeliverableLocation location) {
        return repo.save(location);
    }

    public List<DeliverableLocation> getAllActiveLocations() {
        return repo.findByActiveTrue();
    }

    public List<DeliverableLocation> getByPincode(String pincode) {
        return repo.findByPincodeAndActiveTrue(pincode);
    }

    public void deactivateLocation(Long id) {
        DeliverableLocation location = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));
        location.setActive(false);
        repo.save(location);
    }
}