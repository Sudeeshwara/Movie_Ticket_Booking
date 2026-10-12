package lk.ijse.movieticket.service;

import lk.ijse.movieticket.dto.MovieDTO;
import lk.ijse.movieticket.entity.Movie;
import lk.ijse.movieticket.exception.ConflictException;
import lk.ijse.movieticket.exception.ResourceNotFoundException;
import lk.ijse.movieticket.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

    @Transactional
    public MovieDTO createMovie(MovieDTO dto) {
        Movie movie = new Movie();
        apply(movie, dto);
        movie = movieRepository.save(movie);
        log.info("Movie created: id={}, title={}", movie.getId(), movie.getTitle());
        return toDto(movie);
    }

    @Transactional(readOnly = true)
    public List<MovieDTO> getAllMovies() {
        return movieRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public MovieDTO getMovieById(Long id) {
        return toDto(findMovie(id));
    }

    @Transactional
    public MovieDTO updateMovie(Long id, MovieDTO dto) {
        Movie movie = findMovie(id);
        apply(movie, dto);
        log.info("Movie updated: id={}", id);
        return toDto(movieRepository.save(movie));
    }

    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = findMovie(id);
        if (!movie.getShows().isEmpty()) {
            throw new ConflictException("Movie has shows and cannot be deleted. Mark it as ENDED instead.");
        }
        movieRepository.delete(movie);
        log.info("Movie deleted: id={}", id);
    }

    public Movie findMovie(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id " + id));
    }

    private void apply(Movie movie, MovieDTO dto) {
        movie.setTitle(dto.getTitle().trim());
        movie.setDescription(dto.getDescription());
        movie.setDuration(dto.getDuration());
        movie.setLanguage(dto.getLanguage().trim());
        movie.setGenre(dto.getGenre().trim());
        movie.setReleaseDate(dto.getReleaseDate());
        movie.setStatus(dto.getStatus());
    }

    private MovieDTO toDto(Movie m) {
        return MovieDTO.builder()
                .id(m.getId())
                .title(m.getTitle())
                .description(m.getDescription())
                .duration(m.getDuration())
                .language(m.getLanguage())
                .genre(m.getGenre())
                .releaseDate(m.getReleaseDate())
                .status(m.getStatus())
                .build();
    }
}
