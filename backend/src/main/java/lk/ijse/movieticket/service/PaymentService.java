package lk.ijse.movieticket.service;

import lk.ijse.movieticket.dto.PaymentRequest;
import lk.ijse.movieticket.dto.PaymentResponse;
import lk.ijse.movieticket.dto.PaymentStatusResponse;
import lk.ijse.movieticket.entity.Booking;
import lk.ijse.movieticket.entity.Payment;
import lk.ijse.movieticket.entity.User;
import lk.ijse.movieticket.enums.BookingStatus;
import lk.ijse.movieticket.enums.PaymentStatus;
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

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;
    private final CurrentUserService currentUserService;

    /**
     * Creates the (single) payment for a booking in PENDING state.
     * If a PENDING or FAILED payment already exists it is reused so the customer can retry.
     */
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Booking booking = bookingService.findBooking(request.getBookingId());
        assertBookingOwner(booking);

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cancelled bookings cannot be paid for");
        }

        Payment payment = paymentRepository.findByBookingId(booking.getId()).orElse(null);
        if (payment != null) {
            if (payment.getStatus() == PaymentStatus.COMPLETED) {
                throw new ConflictException("This booking has already been paid");
            }
            if (payment.getStatus() == PaymentStatus.REFUNDED) {
                throw new BadRequestException("This payment was refunded and cannot be reused");
            }
            payment.setPaymentMethod(request.getPaymentMethod());
            payment.setStatus(PaymentStatus.PENDING);
        } else {
            payment = Payment.builder()
                    .booking(booking)
                    .amount(booking.getTotalAmount())
                    .paymentMethod(request.getPaymentMethod())
                    .status(PaymentStatus.PENDING)
                    .build();
            booking.setPayment(payment);
        }
        payment = paymentRepository.save(payment);
        log.info("Payment created: id={}, bookingId={}, amount={}, method={}",
                payment.getId(), booking.getId(), payment.getAmount(), payment.getPaymentMethod());
        return toResponse(payment);
    }

    /** Processes the payment with a simulated gateway result. */
    @Transactional
    public PaymentResponse processPayment(Long id, boolean success) {
        Payment payment = findPayment(id);
        Booking booking = payment.getBooking();
        assertBookingOwner(booking);

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            throw new ConflictException("A completed payment cannot be processed again");
        }
        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new BadRequestException("A refunded payment cannot be processed");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cancelled bookings cannot be paid for");
        }

        payment.setPaymentDate(LocalDateTime.now());
        if (success) {
            payment.setStatus(PaymentStatus.COMPLETED);
            booking.setStatus(BookingStatus.CONFIRMED); // completed payment confirms the booking
            bookingRepository.save(booking);
            log.info("Payment completed: id={}, bookingId={} confirmed", id, booking.getId());
        } else {
            payment.setStatus(PaymentStatus.FAILED);     // failed payment does not confirm the booking
            log.warn("Payment failed: id={}, bookingId={}", id, booking.getId());
        }
        return toResponse(paymentRepository.save(payment));
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = findPayment(id);
        bookingService.assertOwnerOrAdmin(payment.getBooking());
        return toResponse(payment);
    }

    @Transactional(readOnly = true)
    public PaymentStatusResponse getPaymentStatus(Long id) {
        Payment payment = findPayment(id);
        bookingService.assertOwnerOrAdmin(payment.getBooking());
        return new PaymentStatusResponse(payment.getId(), payment.getStatus());
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream().map(this::toResponse).toList();
    }

    private void assertBookingOwner(Booking booking) {
        User current = currentUserService.getCurrentUser();
        if (!booking.getUser().getId().equals(current.getId())) {
            throw new AccessDeniedException("You can only pay for your own bookings");
        }
    }

    private Payment findPayment(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));
    }

    private PaymentResponse toResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .bookingId(p.getBooking().getId())
                .bookingStatus(p.getBooking().getStatus())
                .amount(p.getAmount())
                .paymentDate(p.getPaymentDate())
                .paymentMethod(p.getPaymentMethod())
                .status(p.getStatus())
                .build();
    }
}
