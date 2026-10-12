package lk.ijse.movieticket.dto;

import lk.ijse.movieticket.enums.BookingStatus;
import lk.ijse.movieticket.enums.PaymentMethod;
import lk.ijse.movieticket.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private BookingStatus bookingStatus;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
}
