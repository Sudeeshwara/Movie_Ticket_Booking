package lk.ijse.movieticket.dto;

import jakarta.validation.constraints.NotNull;
import lk.ijse.movieticket.enums.BookingStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private BookingStatus status;
}
