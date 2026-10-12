import axiosClient from "./axiosClient";
import type { AuthResponse, SignInRequest, SignUpRequest } from "../types";

export const authService = {
  signIn: (data: SignInRequest) => axiosClient.post<AuthResponse>("/auth/signin", data).then((r) => r.data),
  signUp: (data: SignUpRequest) => axiosClient.post<AuthResponse>("/auth/signup", data).then((r) => r.data),
};
