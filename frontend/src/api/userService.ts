import axiosClient from "./axiosClient";
import type { User, UserUpdateRequest } from "../types";

export const userService = {
  getAll: () => axiosClient.get<User[]>("/users").then((r) => r.data),
  getById: (id: number) => axiosClient.get<User>(`/users/${id}`).then((r) => r.data),
  update: (id: number, data: UserUpdateRequest) => axiosClient.put<User>(`/users/${id}`, data).then((r) => r.data),
  remove: (id: number) => axiosClient.delete<void>(`/users/${id}`).then(() => undefined),
};
