import axiosClient from "./axiosClient";
import type { Movie, MovieRequest } from "../types";

export const movieService = {
  getAll: () => axiosClient.get<Movie[]>("/movies").then((r) => r.data),
  getById: (id: number) => axiosClient.get<Movie>(`/movies/${id}`).then((r) => r.data),
  create: (data: MovieRequest) => axiosClient.post<Movie>("/movies", data).then((r) => r.data),
  update: (id: number, data: MovieRequest) => axiosClient.put<Movie>(`/movies/${id}`, data).then((r) => r.data),
  remove: (id: number) => axiosClient.delete<void>(`/movies/${id}`).then(() => undefined),
};
