package lk.ijse.movieticket.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {

    @NotNull(message = "Show id is required")
    private Long showId;

    @NotEmpty(message = "At least one seat must be selected")
    private List<@NotBlank(message = "Seat number cannot be blank") String> seatNumbers;

    @NotNull(message = "Number of tickets is required")
    @Min(value = 1, message = "Number of tickets must be at least 1")
    private Integer numberOfTickets;
}
