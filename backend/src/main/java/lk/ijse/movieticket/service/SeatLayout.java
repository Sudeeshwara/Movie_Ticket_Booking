package lk.ijse.movieticket.service;

import java.util.ArrayList;
import java.util.List;

/**
 * Seat numbers are derived from theatre capacity: rows A, B, C ... with
 * 10 seats per row (A1..A10, B1..B10, ...). The frontend uses the same rule.
 */
public final class SeatLayout {

    public static final int SEATS_PER_ROW = 10;

    private SeatLayout() {
    }

    public static List<String> generate(int capacity) {
        List<String> seats = new ArrayList<>(capacity);
        for (int i = 0; i < capacity; i++) {
            char row = (char) ('A' + i / SEATS_PER_ROW);
            seats.add(row + String.valueOf(i % SEATS_PER_ROW + 1));
        }
        return seats;
    }
}
