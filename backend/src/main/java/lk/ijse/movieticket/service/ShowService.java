package lk.ijse.movieticket.service;

import lk.ijse.movieticket.dto.SeatAvailabilityResponse;
import lk.ijse.movieticket.dto.ShowRequest;
import lk.ijse.movieticket.dto.ShowResponse;
import lk.ijse.movieticket.entity.Movie;
import lk.ijse.movieticket.entity.Show;
import lk.ijse.movieticket.entity.Theatre;
import lk.ijse.movieticket.enums.BookingStatus;
import lk.ijse.movieticket.enums.MovieStatus;
import lk.ijse.movieticket.enums.ShowStatus;
import lk.ijse.movieticket.enums.TheatreStatus;
import lk.ijse.movieticket.exception.BadRequestException;
import lk.ijse.movieticket.exception.ConflictException;
import lk.ijse.movieticket.exception.ResourceNotFoundException;
import lk.ijse.movieticket.repository.BookingRepository;
import lk.ijse.movieticket.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShowService {

    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;
    private final MovieService movieService;
    private final TheatreService theatreService;

    @Transactional
    public ShowResponse createShow(ShowRequest request) {
        Movie movie = movieService.findMovie(request.getMovieId());
        Theatre theatre = theatreService.findTheatre(request.getTheatreId());

        if (movie.getStatus() == MovieStatus.ENDED) {
            throw new BadRequestException("Cannot create a show for a movie that has ENDED");
        }
        if (theatre.getStatus() != TheatreStatus.ACTIVE) {
            throw new BadRequestException("Shows can only be created for an ACTIVE theatre");
        }
        if (request.getShowDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Show date cannot be in the past");
        }
        if (showRepository.existsByTheatreIdAndShowDateAndShowTimeAndStatusNot(
                theatre.getId(), request.getShowDate(), request.getShowTime(), ShowStatus.CANCELLED)) {
            throw new ConflictException("This theatre already has a show at the same date and time");
        }

        Show show = Show.builder()
                .movie(movie)
                .theatre(theatre)
                .showDate(request.getShowDate())
                .showTime(request.getShowTime())
                .ticketPrice(request.getTicketPrice())
                .status(request.getStatus() != null ? request.getStatus() : ShowStatus.SCHEDULED)
                .build();
        show = showRepository.save(show);
        log.info("Show created: id={}, movieId={}, theatreId={}, {} {}",
                show.getId(), movie.getId(), theatre.getId(), show.getShowDate(), show.getShowTime());
        return toResponse(show);
    }

    @Transactional(readOnly = true)
    public List<ShowResponse> getAllShows() {
        return showRepository.findAllByOrderByShowDateAscShowTimeAsc().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ShowResponse getShowById(Long id) {
        return toResponse(findShow(id));
    }

    @Transactional(readOnly = true)
    public List<ShowResponse> getShowsByMovie(Long movieId) {
        movieService.findMovie(movieId); // 404 if the movie does not exist
        return showRepository.findByMovieIdOrderByShowDateAscShowTimeAsc(movieId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public ShowResponse updateShow(Long id, ShowRequest request) {
        Show show = findShow(id);
        Movie movie = movieService.findMovie(request.getMovieId());
        Theatre theatre = theatreService.findTheatre(request.getTheatreId());

        if (!movie.getId().equals(show.getMovie().getId()) && movie.getStatus() == MovieStatus.ENDED) {
            throw new BadRequestException("Cannot move a show to a movie that has ENDED");
        }
        if (!theatre.getId().equals(show.getTheatre().getId()) && theatre.getStatus() != TheatreStatus.ACTIVE) {
            throw new BadRequestException("Shows can only be assigned to an ACTIVE theatre");
        }

        ShowStatus newStatus = request.getStatus() != null ? request.getStatus() : show.getStatus();
        if (newStatus != ShowStatus.CANCELLED
                && showRepository.existsByTheatreIdAndShowDateAndShowTimeAndStatusNotAndIdNot(
                theatre.getId(), request.getShowDate(), request.getShowTime(), ShowStatus.CANCELLED, id)) {
            throw new ConflictException("This theatre already has a show at the same date and time");
        }

        show.setMovie(movie);
        show.setTheatre(theatre);
        show.setShowDate(request.getShowDate());
        show.setShowTime(request.getShowTime());
        show.setTicketPrice(request.getTicketPrice());
        show.setStatus(newStatus);
        log.info("Show updated: id={}, status={}", id, newStatus);
        return toResponse(showRepository.save(show));
    }

    @Transactional
    public void deleteShow(Long id) {
        Show show = findShow(id);
        if (!show.getBookings().isEmpty()) {
            throw new ConflictException("Show has bookings and cannot be deleted. Mark it as CANCELLED instead.");
        }
        showRepository.delete(show);
        log.info("Show deleted: id={}", id);
    }

    @Transactional(readOnly = true)
    public SeatAvailabilityResponse getSeatAvailability(Long id) {
        Show show = findShow(id);
        int capacity = show.getTheatre().getCapacity();
        List<String> booked = bookingRepository.findBookedSeatNumbers(id, BookingStatus.CANCELLED);
        return SeatAvailabilityResponse.builder()
                .showId(id)
                .capacity(capacity)
                .allSeats(SeatLayout.generate(capacity))
                .bookedSeats(booked)
                .availableCount(capacity - booked.size())
                .build();
    }

    public Show findShow(Long id) {
        return showRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found with id " + id));
    }

    public ShowResponse toResponse(Show s) {
        return ShowResponse.builder()
                .id(s.getId())
                .movieId(s.getMovie().getId())
                .movieTitle(s.getMovie().getTitle())
                .theatreId(s.getTheatre().getId())
                .theatreName(s.getTheatre().getName())
                .theatreLocation(s.getTheatre().getLocation())
                .theatreCapacity(s.getTheatre().getCapacity())
                .showDate(s.getShowDate())
                .showTime(s.getShowTime())
                .ticketPrice(s.getTicketPrice())
                .status(s.getStatus())
                .build();
    }
}
