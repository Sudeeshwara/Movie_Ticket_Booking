package lk.ijse.movieticket.dto;

import lk.ijse.movieticket.enums.PaymentStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusResponse {
    private Long paymentId;
    private PaymentStatus status;
}
