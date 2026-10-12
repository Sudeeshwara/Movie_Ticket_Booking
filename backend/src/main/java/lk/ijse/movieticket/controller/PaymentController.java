package lk.ijse.movieticket.controller;

import jakarta.validation.Valid;
import lk.ijse.movieticket.dto.PaymentProcessRequest;
import lk.ijse.movieticket.dto.PaymentRequest;
import lk.ijse.movieticket.dto.PaymentResponse;
import lk.ijse.movieticket.dto.PaymentStatusResponse;
import lk.ijse.movieticket.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /** Create payment (PENDING) for a booking. */
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.createPayment(request));
    }

    /** Process payment (simulated gateway result). */
    @PutMapping("/{id}/process")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentResponse> processPayment(@PathVariable Long id,
                                                          @Valid @RequestBody PaymentProcessRequest request) {
        return ResponseEntity.ok(paymentService.processPayment(id, request.getSuccess()));
    }

    /** ADMIN: view payment information. */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    /** Get payment details (owner or ADMIN). */
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    /** Check payment status (owner or ADMIN). */
    @GetMapping("/{id}/status")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(id));
    }
}
