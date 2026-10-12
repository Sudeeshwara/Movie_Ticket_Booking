package lk.ijse.movieticket.service;

import lk.ijse.movieticket.dto.UserResponse;
import lk.ijse.movieticket.dto.UserUpdateRequest;
import lk.ijse.movieticket.entity.User;
import lk.ijse.movieticket.exception.BadRequestException;
import lk.ijse.movieticket.exception.ConflictException;
import lk.ijse.movieticket.exception.ResourceNotFoundException;
import lk.ijse.movieticket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User current = currentUserService.getCurrentUser();
        assertSelfOrAdmin(current, id);
        return toResponse(findUser(id));
    }

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User current = currentUserService.getCurrentUser();
        assertSelfOrAdmin(current, id);
        User user = findUser(id);

        String email = request.getEmail().trim().toLowerCase();
        if (!email.equals(user.getEmail()) && userRepository.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists");
        }
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone() == null || request.getPhone().isBlank() ? null : request.getPhone().trim());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (request.getPassword().length() < 6) {
                throw new BadRequestException("Password must be at least 6 characters");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRole() != null && request.getRole() != user.getRole()) {
            if (!currentUserService.isAdmin(current)) {
                throw new AccessDeniedException("Only an admin can change roles");
            }
            if (current.getId().equals(user.getId())) {
                throw new BadRequestException("You cannot change your own role");
            }
            user.setRole(request.getRole());
        }

        log.info("User updated: id={} by userId={}", id, current.getId());
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        User current = currentUserService.getCurrentUser();
        if (current.getId().equals(id)) {
            throw new BadRequestException("You cannot delete your own account");
        }
        User user = findUser(id);
        if (!user.getBookings().isEmpty()) {
            throw new ConflictException("User has bookings and cannot be deleted");
        }
        userRepository.delete(user);
        log.info("User deleted: id={} by adminId={}", id, current.getId());
    }

    private void assertSelfOrAdmin(User current, Long targetId) {
        if (!currentUserService.isAdmin(current) && !current.getId().equals(targetId)) {
            throw new AccessDeniedException("Access denied");
        }
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    private UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .role(u.getRole())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
