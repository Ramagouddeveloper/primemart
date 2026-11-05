package com.primemart.dto;


public class ProductResponse {

    private Long id;
    private String name;
    private String quantitity;
    private String price;
    private String actualPrice;
    private String category;
    private String image; // Base64 string

    public ProductResponse() {}

    public ProductResponse(Long id, String name, String quantitity, String price,
                           String actualPrice, String category, String image) {
        this.id = id;
        this.name = name;
        this.quantitity = quantitity;
        this.price = price;
        this.actualPrice = actualPrice;
        this.category = category;
        this.image = image;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getQuantitity() { return quantitity; }
    public String getPrice() { return price; }
    public String getActualPrice() { return actualPrice; }
    public String getCategory() { return category; }
    public String getImage() { return image; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setQuantitity(String quantitity) { this.quantitity = quantitity; }
    public void setPrice(String price) { this.price = price; }
    public void setActualPrice(String actualPrice) { this.actualPrice = actualPrice; }
    public void setCategory(String category) { this.category = category; }
    public void setImage(String image) { this.image = image; }
}
