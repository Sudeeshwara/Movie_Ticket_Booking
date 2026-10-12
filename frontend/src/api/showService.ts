import axiosClient from "./axiosClient";
import type { SeatAvailability, Show, ShowRequest } from "../types";

export const showService = {
  getAll: () => axiosClient.get<Show[]>("/shows").then((r) => r.data),
  getById: (id: number) => axiosClient.get<Show>(`/shows/${id}`).then((r) => r.data),
  getByMovie: (movieId: number) => axiosClient.get<Show[]>(`/shows/movie/${movieId}`).then((r) => r.data),
  getSeats: (id: number) => axiosClient.get<SeatAvailability>(`/shows/${id}/seats`).then((r) => r.data),
  create: (data: ShowRequest) => axiosClient.post<Show>("/shows", data).then((r) => r.data),
  update: (id: number, data: ShowRequest) => axiosClient.put<Show>(`/shows/${id}`, data).then((r) => r.data),
  remove: (id: number) => axiosClient.delete<void>(`/shows/${id}`).then(() => undefined),
};
