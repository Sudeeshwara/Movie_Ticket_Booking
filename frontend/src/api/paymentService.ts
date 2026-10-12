import axiosClient from "./axiosClient";
import type { Payment, PaymentRequest, PaymentStatusResponse } from "../types";

export const paymentService = {
  create: (data: PaymentRequest) => axiosClient.post<Payment>("/payments", data).then((r) => r.data),
  /** The payment gateway is simulated by the backend: success decides the outcome. */
  process: (id: number, success: boolean) =>
    axiosClient.put<Payment>(`/payments/${id}/process`, { success }).then((r) => r.data),
  getAll: () => axiosClient.get<Payment[]>("/payments").then((r) => r.data),
  getById: (id: number) => axiosClient.get<Payment>(`/payments/${id}`).then((r) => r.data),
  getStatus: (id: number) => axiosClient.get<PaymentStatusResponse>(`/payments/${id}/status`).then((r) => r.data),
};
