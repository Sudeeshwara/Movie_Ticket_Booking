package lk.ijse.movieticket.repository;

import lk.ijse.movieticket.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
}
