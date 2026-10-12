import axiosClient from "./axiosClient";
import type { Theatre, TheatreRequest } from "../types";

export const theatreService = {
  getAll: () => axiosClient.get<Theatre[]>("/theatres").then((r) => r.data),
  getById: (id: number) => axiosClient.get<Theatre>(`/theatres/${id}`).then((r) => r.data),
  create: (data: TheatreRequest) => axiosClient.post<Theatre>("/theatres", data).then((r) => r.data),
  update: (id: number, data: TheatreRequest) => axiosClient.put<Theatre>(`/theatres/${id}`, data).then((r) => r.data),
  remove: (id: number) => axiosClient.delete<void>(`/theatres/${id}`).then(() => undefined),
};
