package lk.ijse.movieticket.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatAvailabilityResponse {
    private Long showId;
    private Integer capacity;
    private List<String> allSeats;
    private List<String> bookedSeats;
    private Integer availableCount;
}
