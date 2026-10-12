package lk.ijse.movieticket.dto;

import lk.ijse.movieticket.enums.BookingStatus;
import lk.ijse.movieticket.enums.PaymentStatus;
import lk.ijse.movieticket.enums.ShowStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long showId;
    private String movieTitle;
    private String theatreName;
    private LocalDate showDate;
    private LocalTime showTime;
    private ShowStatus showStatus;
    private BigDecimal ticketPrice;
    private List<String> seatNumbers;
    private Integer numberOfTickets;
    private BigDecimal totalAmount;
    private LocalDateTime bookingDate;
    private BookingStatus status;
    private Long paymentId;
    private PaymentStatus paymentStatus;
}
