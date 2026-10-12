package lk.ijse.movieticket.repository;

import lk.ijse.movieticket.entity.Show;
import lk.ijse.movieticket.enums.ShowStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {

    List<Show> findByMovieIdOrderByShowDateAscShowTimeAsc(Long movieId);

    List<Show> findAllByOrderByShowDateAscShowTimeAsc();

    /** Used to detect conflicting shows in the same theatre at the same date and time. */
    boolean existsByTheatreIdAndShowDateAndShowTimeAndStatusNot(
            Long theatreId, LocalDate showDate, LocalTime showTime, ShowStatus status);

    boolean existsByTheatreIdAndShowDateAndShowTimeAndStatusNotAndIdNot(
            Long theatreId, LocalDate showDate, LocalTime showTime, ShowStatus status, Long id);
}
