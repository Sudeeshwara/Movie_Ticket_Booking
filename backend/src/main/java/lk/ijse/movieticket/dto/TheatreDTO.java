package lk.ijse.movieticket.dto;

import jakarta.validation.constraints.*;
import lk.ijse.movieticket.enums.TheatreStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheatreDTO {

    private Long id;

    @NotBlank(message = "Theatre name is required")
    @Size(max = 100, message = "Theatre name must be at most 100 characters")
    private String name;

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must be at most 200 characters")
    private String location;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 260, message = "Capacity must be at most 260 (rows A-Z, 10 seats each)")
    private Integer capacity;

    @NotNull(message = "Status is required")
    private TheatreStatus status;
}
