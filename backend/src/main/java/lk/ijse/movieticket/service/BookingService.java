package lk.ijse.movieticket.service;

import lk.ijse.movieticket.dto.BookingRequest;
import lk.ijse.movieticket.dto.BookingResponse;
import lk.ijse.movieticket.entity.Booking;
import lk.ijse.movieticket.entity.Payment;
import lk.ijse.movieticket.entity.Show;
import lk.ijse.movieticket.entity.User;
import lk.ijse.movieticket.enums.BookingStatus;
import lk.ijse.movieticket.enums.PaymentStatus;
import lk.ijse.movieticket.enums.ShowStatus;
import lk.ijse.movieticket.exception.BadRequestException;
import lk.ijse.movieticket.exception.ConflictException;
import lk.ijse.movieticket.exception.ResourceNotFoundException;
import lk.ijse.movieticket.repository.BookingRepository;
import lk.ijse.movieticket.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final ShowService showService;
    private final CurrentUserService currentUserService;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        User customer = currentUserService.getCurrentUser();
        Show show = showService.findShow(request.getShowId());

        if (show.getStatus() == ShowStatus.CANCELLED) {
            throw new BadRequestException("This show has been cancelled and cannot accept bookings");
        }
        if (show.getStatus() == ShowStatus.COMPLETED) {
            throw new BadRequestException("This show is completed and cannot accept new bookings");
        }

        // Normalise seat numbers (trim + upper case) and reject duplicates in the same request
        List<String> seats = request.getSeatNumbers().stream().map(s -> s.trim().toUpperCase()).toList();
        if (seats.isEmpty()) {
            throw new BadRequestException("A booking must contain at least one seat");
        }
        if (new HashSet<>(seats).size() != seats.size()) {
            throw new BadRequestException("Duplicate seat numbers in request");
        }
        if (request.getNumberOfTickets() != seats.size()) {
            throw new BadRequestException("Number of tickets (" + request.getNumberOfTickets()
                    + ") must match the number of selected seats (" + seats.size() + ")");
        }

        Set<String> validSeats = new HashSet<>(SeatLayout.generate(show.getTheatre().getCapacity()));
        List<String> invalid = seats.stream().filter(s -> !validSeats.contains(s)).toList();
        if (!invalid.isEmpty()) {
            throw new BadRequestException("Invalid seat numbers for this theatre: " + String.join(", ", invalid));
        }

        Set<String> alreadyBooked = new HashSet<>(
                bookingRepository.findBookedSeatNumbers(show.getId(), BookingStatus.CANCELLED));
        List<String> taken = seats.stream().filter(alreadyBooked::contains).toList();
        if (!taken.isEmpty()) {
            throw new ConflictException("Seats already booked: " + String.join(", ", taken));
        }

        BigDecimal total = show.getTicketPrice().multiply(BigDecimal.valueOf(seats.size()));

        Booking booking = Booking.builder()
                .user(customer)
                .show(show)
                .seatNumbers(new ArrayList<>(seats))
                .numberOfTickets(seats.size())
                .totalAmount(total)
                .bookingDate(LocalDateTime.now())
                .status(BookingStatus.PENDING)
                .build();
        booking = bookingRepository.save(booking);
        log.info("Booking created: id={}, userId={}, showId={}, seats={}, total={}",
                booking.getId(), customer.getId(), show.getId(), seats, total);
        return toResponse(booking);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = findBooking(id);
        assertOwnerOrAdmin(booking);
        return toResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings() {
        User user = currentUserService.getCurrentUser();
        return bookingRepository.findByUserIdOrderByBookingDateDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingDateDesc().stream().map(this::toResponse).toList();
    }

    /** Customer cancels their own booking. */
    @Transactional
    public BookingResponse cancelBooking(Long id) {
        Booking booking = findBooking(id);
        User current = currentUserService.getCurrentUser();
        if (!booking.getUser().getId().equals(current.getId())) {
            throw new AccessDeniedException("You can only cancel your own bookings");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        Show show = booking.getShow();
        if (show.getStatus() == ShowStatus.COMPLETED) {
            throw new BadRequestException("Bookings for a completed show cannot be cancelled");
        }
        if (show.getStatus() == ShowStatus.SCHEDULED
                && LocalDateTime.of(show.getShowDate(), show.getShowTime()).isBefore(LocalDateTime.now())) {
            throw new BadRequestException("This show has already started and the booking cannot be cancelled");
        }
        cancel(booking);
        log.info("Booking cancelled by customer: id={}, userId={}", id, current.getId());
        return toResponse(booking);
    }

    /** Admin updates booking status. */
    @Transactional
    public BookingResponse updateBookingStatus(Long id, BookingStatus newStatus) {
        Booking booking = findBooking(id);
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("A cancelled booking cannot be changed");
        }
        Payment payment = booking.getPayment();
        boolean paid = payment != null && payment.getStatus() == PaymentStatus.COMPLETED;

        switch (newStatus) {
            case CONFIRMED -> {
                if (!paid) {
                    throw new BadRequestException("Only bookings with a completed payment can be confirmed");
                }
                booking.setStatus(BookingStatus.CONFIRMED);
            }
            case PENDING -> {
                if (paid) {
                    throw new BadRequestException("A booking with a completed payment cannot be set back to PENDING");
                }
                booking.setStatus(BookingStatus.PENDING);
            }
            case CANCELLED -> cancel(booking);
        }
        log.info("Booking status updated by admin: id={}, status={}", id, newStatus);
        return toResponse(bookingRepository.save(booking));
    }

    /** Cancels the booking (releasing its seats) and refunds a completed payment. */
    private void cancel(Booking booking) {
        booking.setStatus(BookingStatus.CANCELLED);
        Payment payment = booking.getPayment();
        if (payment != null && payment.getStatus() == PaymentStatus.COMPLETED) {
            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
            log.info("Payment refunded: paymentId={}, bookingId={}", payment.getId(), booking.getId());
        }
        bookingRepository.save(booking);
    }

    public Booking findBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));
    }

    public void assertOwnerOrAdmin(Booking booking) {
        User current = currentUserService.getCurrentUser();
        if (!currentUserService.isAdmin(current) && !booking.getUser().getId().equals(current.getId())) {
            throw new AccessDeniedException("Access denied");
        }
    }

    private BookingResponse toResponse(Booking b) {
        Show s = b.getShow();
        Payment p = b.getPayment();
        return BookingResponse.builder()
                .id(b.getId())
                .userId(b.getUser().getId())
                .userName(b.getUser().getName())
                .userEmail(b.getUser().getEmail())
                .showId(s.getId())
                .movieTitle(s.getMovie().getTitle())
                .theatreName(s.getTheatre().getName())
                .showDate(s.getShowDate())
                .showTime(s.getShowTime())
                .showStatus(s.getStatus())
                .ticketPrice(s.getTicketPrice())
                .seatNumbers(new ArrayList<>(b.getSeatNumbers()))
                .numberOfTickets(b.getNumberOfTickets())
                .totalAmount(b.getTotalAmount())
                .bookingDate(b.getBookingDate())
                .status(b.getStatus())
                .paymentId(p != null ? p.getId() : null)
                .paymentStatus(p != null ? p.getStatus() : null)
                .build();
    }
}
