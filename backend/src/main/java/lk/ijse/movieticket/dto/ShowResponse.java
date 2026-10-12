package lk.ijse.movieticket.dto;

import lk.ijse.movieticket.enums.ShowStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowResponse {
    private Long id;
    private Long movieId;
    private String movieTitle;
    private Long theatreId;
    private String theatreName;
    private String theatreLocation;
    private Integer theatreCapacity;
    private LocalDate showDate;
    private LocalTime showTime;
    private BigDecimal ticketPrice;
    private ShowStatus status;
}
