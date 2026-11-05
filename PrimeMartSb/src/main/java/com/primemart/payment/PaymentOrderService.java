package com.primemart.payment;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.primemart.entity.Order;
import com.primemart.entity.OrderItem;
import com.primemart.entity.Product;
import com.primemart.entity.Payment;
import com.primemart.repository.OrderRepository;
import com.primemart.repository.OrderItemRepository;
import com.primemart.repository.ProductRepository;
import com.primemart.repository.PaymentRepository;

@Service
public class PaymentOrderService {

    private final OrderRepository orderRepo;
    private final OrderItemRepository itemRepo;
    private final ProductRepository productRepo;
    private final PaymentRepository paymentRepo;

    public PaymentOrderService(
            OrderRepository orderRepo,
            OrderItemRepository itemRepo,
            ProductRepository productRepo,
            PaymentRepository paymentRepo) {

        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.productRepo = productRepo;
        this.paymentRepo = paymentRepo;
    }

    @Transactional
    public Order placeOrder(
            Map<String, Object> req,
            String paymentMethod,
            String gatewayOrderId,
            String gatewayPaymentId) {

        String username = String.valueOf(req.get("username"));

        /*
         * Product location:
         * The location selected by the user for viewing products.
         */
        Long productLocationId =
                Long.valueOf(String.valueOf(req.get("productLocationId")));

        /*
         * Delivery location:
         * The location/address selected by the user for delivery.
         */
        Long deliveryLocationId =
                Long.valueOf(String.valueOf(req.get("deliveryLocationId")));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items =
                (List<Map<String, Object>>) req.get("items");

        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        /*
         * Create Order
         */
        Order order = new Order();

        order.setUsername(username);
        order.setPaymentMethod(paymentMethod);
        order.setStatus("PENDING");

        /*
         * Product location
         */
        order.setProductLocationId(productLocationId);

        /*
         * Delivery location
         */
        order.setDeliveryLocationId(deliveryLocationId);

        /*
         * Keep old locationId as delivery location
         * for compatibility with existing code.
         */
        order.setLocationId(deliveryLocationId);

        Order saved = orderRepo.save(order);

        double total = 0;

        /*
         * Process cart items
         */
        for (Map<String, Object> item : items) {

            Long productId =
                    Long.valueOf(String.valueOf(item.get("productId")));

            int qty =
                    Integer.parseInt(String.valueOf(item.get("quantity")));

            if (qty <= 0) {
                throw new IllegalArgumentException("Invalid quantity");
            }

            /*
             * Find product
             */
            Product p = productRepo.findById(productId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Product not found: " + productId
                            )
                    );

            /*
             * IMPORTANT:
             *
             * Compare PRODUCT location with PRODUCT location.
             *
             * Do NOT compare deliveryLocationId here.
             */
            if (!productLocationId.equals(p.getLocationId())) {

                throw new IllegalArgumentException(
                        "Product does not belong to selected product location: "
                                + p.getName()
                );
            }

            /*
             * Check stock
             */
            if (qty > p.getQuantity()) {

                throw new IllegalArgumentException(
                        "Only "
                                + p.getQuantity()
                                + " items available for "
                                + p.getName()
                );
            }

            /*
             * Calculate price from database.
             */
            double line = p.getPrice() * qty;

            total += line;

            /*
             * Reduce stock
             */
            p.setQuantity(p.getQuantity() - qty);

            productRepo.save(p);

            /*
             * Create order item
             */
            OrderItem oi = new OrderItem();

            oi.setOrderId(saved.getId());
            oi.setProductId(productId);
            oi.setQuantity(qty);
            oi.setPrice(p.getPrice());

            itemRepo.save(oi);
        }

        /*
         * Save final order total
         */
        saved.setTotal(total);

        orderRepo.save(saved);

        /*
         * Save payment
         */
        Payment payment = new Payment();

        payment.setOrderId(saved.getId());
        payment.setMethod(paymentMethod);

        payment.setStatus(
                "COD".equals(paymentMethod)
                        ? "COD_PENDING"
                        : "CAPTURED"
        );

        payment.setAmount(total);

        payment.setGatewayOrderId(gatewayOrderId);
        payment.setGatewayPaymentId(gatewayPaymentId);

        paymentRepo.save(payment);

        return saved;
    }
}