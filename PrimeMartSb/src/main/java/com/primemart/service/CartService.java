package com.primemart.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.primemart.entity.Cart;
import com.primemart.entity.CartItem;
import com.primemart.entity.User;
import com.primemart.record.ProductQuantity;
import com.primemart.repository.CartItemRepository;
import com.primemart.repository.CartRepository;
import com.primemart.repository.ProductRepository;
import com.primemart.repository.UserRepository;

import lombok.Data;

@Service
@Data
public class CartService {

	private final UserRepository userRepo;
	private final ProductRepository productRepo;
	private final CartRepository cartRepo;
	private final CartItemRepository cartItemRepo;

	public List<CartItem> getCartItems(String username) {

		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

		Cart cart = cartRepo.findByUser(user).orElseThrow(() -> new RuntimeException("Cart not found"));

		 List<CartItem> cartItemsList = cartItemRepo.findByCart(cart);
		 
//		 List<Long> productids = cartItemsList.stream().map(item->item.getProduct().getId() ).collect(Collectors.toList());
//		List<ProductQuantity> products = productRepo.findProductQuntityByProductIds(productids);
//		
//		
//		Map<Long, Integer> productQuantityMap = products.stream()
//		        .collect(Collectors.toMap(
//		                ProductQuantity::id,
//		                ProductQuantity::quantity
//		        ));
//
//		return cartItemsList.stream()
//		        .peek(item -> item.setNoOfItemsAvalableForSell(
//		                productQuantityMap.getOrDefault(
//		                        item.getProduct().getId(), 0
//		                )
//		        ))
//		        .collect(Collectors.toList());
		return cartItemsList;
	}
}
