package lk.ijse.movieticket.dto;

import jakarta.validation.constraints.*;
import lk.ijse.movieticket.enums.MovieStatus;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be at most 150 characters")
    private String title;

    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String description;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be a positive number of minutes")
    private Integer duration;

    @NotBlank(message = "Language is required")
    private String language;

    @NotBlank(message = "Genre is required")
    private String genre;

    private LocalDate releaseDate;

    @NotNull(message = "Status is required")
    private MovieStatus status;
}
