package com.primemart.entity;


import jakarta.persistence.*;

@Entity
@Table(name="cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name="user_id")
    private User user;

    public Cart(){}

    public Long getId() { return id; }
    public User getUser() { return user; }

    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
}
