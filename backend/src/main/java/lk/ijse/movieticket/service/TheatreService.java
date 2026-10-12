package lk.ijse.movieticket.service;

import lk.ijse.movieticket.dto.TheatreDTO;
import lk.ijse.movieticket.entity.Theatre;
import lk.ijse.movieticket.exception.ConflictException;
import lk.ijse.movieticket.exception.ResourceNotFoundException;
import lk.ijse.movieticket.repository.TheatreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TheatreService {

    private final TheatreRepository theatreRepository;

    @Transactional
    public TheatreDTO createTheatre(TheatreDTO dto) {
        Theatre theatre = new Theatre();
        apply(theatre, dto);
        theatre = theatreRepository.save(theatre);
        log.info("Theatre created: id={}, name={}", theatre.getId(), theatre.getName());
        return toDto(theatre);
    }

    @Transactional(readOnly = true)
    public List<TheatreDTO> getAllTheatres() {
        return theatreRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public TheatreDTO getTheatreById(Long id) {
        return toDto(findTheatre(id));
    }

    @Transactional
    public TheatreDTO updateTheatre(Long id, TheatreDTO dto) {
        Theatre theatre = findTheatre(id);
        apply(theatre, dto);
        log.info("Theatre updated: id={}", id);
        return toDto(theatreRepository.save(theatre));
    }

    @Transactional
    public void deleteTheatre(Long id) {
        Theatre theatre = findTheatre(id);
        if (!theatre.getShows().isEmpty()) {
            throw new ConflictException("Theatre has shows and cannot be deleted. Mark it as INACTIVE instead.");
        }
        theatreRepository.delete(theatre);
        log.info("Theatre deleted: id={}", id);
    }

    public Theatre findTheatre(Long id) {
        return theatreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found with id " + id));
    }

    private void apply(Theatre theatre, TheatreDTO dto) {
        theatre.setName(dto.getName().trim());
        theatre.setLocation(dto.getLocation().trim());
        theatre.setCapacity(dto.getCapacity());
        theatre.setStatus(dto.getStatus());
    }

    private TheatreDTO toDto(Theatre t) {
        return TheatreDTO.builder()
                .id(t.getId())
                .name(t.getName())
                .location(t.getLocation())
                .capacity(t.getCapacity())
                .status(t.getStatus())
                .build();
    }
}
