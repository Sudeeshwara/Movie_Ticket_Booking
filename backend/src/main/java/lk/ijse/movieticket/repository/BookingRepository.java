package lk.ijse.movieticket.repository;

import lk.ijse.movieticket.entity.Booking;
import lk.ijse.movieticket.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByBookingDateDesc(Long userId);

    List<Booking> findAllByOrderByBookingDateDesc();

    /** All seat numbers already taken for a show (cancelled bookings release their seats). */
    @Query("select s from Booking b join b.seatNumbers s " +
           "where b.show.id = :showId and b.status <> :excluded")
    List<String> findBookedSeatNumbers(@Param("showId") Long showId,
                                       @Param("excluded") BookingStatus excluded);
}
