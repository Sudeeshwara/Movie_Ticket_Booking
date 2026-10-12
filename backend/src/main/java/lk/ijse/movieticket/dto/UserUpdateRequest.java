package lk.ijse.movieticket.dto;

import jakarta.validation.constraints.*;
import lk.ijse.movieticket.enums.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @Pattern(regexp = "^$|^[0-9+]{10,15}$", message = "Phone must be 10 to 15 digits")
    private String phone;

    /** Optional. Leave empty to keep the current password. */
    @Size(max = 64, message = "Password must be at most 64 characters")
    private String password;

    /** Optional. Only an ADMIN can change roles. */
    private Role role;
}
