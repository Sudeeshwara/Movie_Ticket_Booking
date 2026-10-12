package lk.ijse.movieticket.dto;

import jakarta.validation.constraints.*;
import lk.ijse.movieticket.enums.ShowStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowRequest {

    @NotNull(message = "Movie id is required")
    private Long movieId;

    @NotNull(message = "Theatre id is required")
    private Long theatreId;

    @NotNull(message = "Show date is required")
    private LocalDate showDate;

    @NotNull(message = "Show time is required")
    private LocalTime showTime;

    @NotNull(message = "Ticket price is required")
    @DecimalMin(value = "0.01", message = "Ticket price must be greater than 0")
    private BigDecimal ticketPrice;

    /** Optional. Defaults to SCHEDULED when creating. */
    private ShowStatus status;
}
