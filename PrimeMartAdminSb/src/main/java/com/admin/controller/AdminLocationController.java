package com.admin.controller;


import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.admin.entity.DeliverableLocation;
import com.admin.service.DeliverableLocationService;

@RestController
@RequestMapping("/admin/locations")
public class AdminLocationController {

    private final DeliverableLocationService service;

    public AdminLocationController(DeliverableLocationService service) {
        this.service = service;
    }

    @PostMapping
    public DeliverableLocation addLocation(
            @RequestBody DeliverableLocation location) {
        return service.addLocation(location);
    }

    @GetMapping
    public List<DeliverableLocation> getAll() {
        return service.getAllActiveLocations();
    }

    @PutMapping("/deactivate/{id}")
    public String deactivate(@PathVariable Long id) {
        service.deactivateLocation(id);
        return "Location deactivated successfully";
    }
}