package lk.ijse.movieticket.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * No real payment gateway is part of the core scope, so the gateway result
 * is simulated: success=true completes the payment, success=false fails it.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentProcessRequest {
    @NotNull(message = "Payment result is required")
    private Boolean success;
}
