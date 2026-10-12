import axiosClient from "./axiosClient";
import type { Booking, BookingRequest, BookingStatus } from "../types";

export const bookingService = {
  create: (data: BookingRequest) => axiosClient.post<Booking>("/bookings", data).then((r) => r.data),
  getAll: () => axiosClient.get<Booking[]>("/bookings").then((r) => r.data),
  getMine: () => axiosClient.get<Booking[]>("/bookings/my-bookings").then((r) => r.data),
  getById: (id: number) => axiosClient.get<Booking>(`/bookings/${id}`).then((r) => r.data),
  cancel: (id: number) => axiosClient.put<Booking>(`/bookings/${id}/cancel`).then((r) => r.data),
  updateStatus: (id: number, status: BookingStatus) =>
    axiosClient.put<Booking>(`/bookings/${id}/status`, { status }).then((r) => r.data),
};
