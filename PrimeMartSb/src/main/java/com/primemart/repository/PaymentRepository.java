package com.primemart.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.primemart.entity.Payment;
public interface PaymentRepository extends JpaRepository<Payment,Long> { Optional<Payment> findByGatewayPaymentId(String gatewayPaymentId); }
