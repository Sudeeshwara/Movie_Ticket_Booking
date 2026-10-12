import axios from "axios";
import type { ApiError } from "../types";

/** Turns any thrown value (usually an AxiosError) into a user-facing message. */
export function getErrorMessage(err: unknown, fallback = "Something went wrong. Try again."): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return "Cannot reach the server. Check that the backend is running on port 8080.";
    }
    const data = err.response.data as Partial<ApiError> | undefined;
    if (data?.validationErrors && Object.keys(data.validationErrors).length > 0) {
      return Object.values(data.validationErrors).join(" ");
    }
    if (data?.message) return data.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
