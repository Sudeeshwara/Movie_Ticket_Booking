package lk.ijse.movieticket.dto;

import jakarta.validation.constraints.NotNull;
import lk.ijse.movieticket.enums.PaymentMethod;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    @NotNull(message = "Booking id is required")
    private Long bookingId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}
