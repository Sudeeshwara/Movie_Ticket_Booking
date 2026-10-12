package lk.ijse.movieticket.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 64, message = "Password must be 6 to 64 characters")
    private String password;

    @Pattern(regexp = "^$|^[0-9+]{10,15}$", message = "Phone must be 10 to 15 digits")
    private String phone;
}
