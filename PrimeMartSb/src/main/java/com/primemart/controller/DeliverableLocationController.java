package com.primemart.controller;


import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.primemart.entity.DeliverableLocation;
import com.primemart.repository.DeliverableLocationRepository;

@RestController
@RequestMapping("/locations")
public class DeliverableLocationController {

    private final DeliverableLocationRepository repository;

    public DeliverableLocationController(
            DeliverableLocationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<DeliverableLocation> getAllActiveLocations() {
        return repository.findByActiveTrue();
    }

    @PostMapping
    public DeliverableLocation addLocation(
            @RequestBody DeliverableLocation location) {
        return repository.save(location);
    }

    @PutMapping("/{id}/disable")
    public void disableLocation(@PathVariable Long id) {

        DeliverableLocation loc =
                repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        loc.setActive(false);
        repository.save(loc);
    }
}
