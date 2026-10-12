// Types mirror the backend DTOs.

export type Role = "ADMIN" | "CUSTOMER";
export type MovieStatus = "UPCOMING" | "NOW_SHOWING" | "ENDED";
export type TheatreStatus = "ACTIVE" | "INACTIVE";
export type ShowStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type PaymentMethod = "CARD" | "CASH" | "ONLINE_TRANSFER";

export const MOVIE_STATUSES: MovieStatus[] = ["UPCOMING", "NOW_SHOWING", "ENDED"];
export const THEATRE_STATUSES: TheatreStatus[] = ["ACTIVE", "INACTIVE"];
export const SHOW_STATUSES: ShowStatus[] = ["SCHEDULED", "COMPLETED", "CANCELLED"];
export const BOOKING_STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "CANCELLED"];
export const PAYMENT_METHODS: PaymentMethod[] = ["CARD", "CASH", "ONLINE_TRANSFER"];

// ---------- Auth ----------
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
  role: Role;
}

export type AuthUser = Omit<AuthResponse, "token" | "tokenType">;

// ---------- User ----------
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  createdAt: string;
}

export interface UserUpdateRequest {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role?: Role;
}

// ---------- Movie ----------
export interface Movie {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  language: string;
  genre: string;
  releaseDate: string | null;
  status: MovieStatus;
}

export type MovieRequest = Omit<Movie, "id">;

// ---------- Theatre ----------
export interface Theatre {
  id: number;
  name: string;
  location: string;
  capacity: number;
  status: TheatreStatus;
}

export type TheatreRequest = Omit<Theatre, "id">;

// ---------- Show ----------
export interface Show {
  id: number;
  movieId: number;
  movieTitle: string;
  theatreId: number;
  theatreName: string;
  theatreLocation: string;
  theatreCapacity: number;
  showDate: string; // yyyy-MM-dd
  showTime: string; // HH:mm:ss
  ticketPrice: number;
  status: ShowStatus;
}

export interface ShowRequest {
  movieId: number;
  theatreId: number;
  showDate: string;
  showTime: string;
  ticketPrice: number;
  status?: ShowStatus;
}

export interface SeatAvailability {
  showId: number;
  capacity: number;
  allSeats: string[];
  bookedSeats: string[];
  availableCount: number;
}

// ---------- Booking ----------
export interface BookingRequest {
  showId: number;
  seatNumbers: string[];
  numberOfTickets: number;
}

export interface Booking {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  showId: number;
  movieTitle: string;
  theatreName: string;
  showDate: string;
  showTime: string;
  showStatus: ShowStatus;
  ticketPrice: number;
  seatNumbers: string[];
  numberOfTickets: number;
  totalAmount: number;
  bookingDate: string;
  status: BookingStatus;
  paymentId: number | null;
  paymentStatus: PaymentStatus | null;
}

// ---------- Payment ----------
export interface PaymentRequest {
  bookingId: number;
  paymentMethod: PaymentMethod;
}

export interface Payment {
  id: number;
  bookingId: number;
  bookingStatus: BookingStatus;
  amount: number;
  paymentDate: string | null;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
}

export interface PaymentStatusResponse {
  paymentId: number;
  status: PaymentStatus;
}

// ---------- Errors ----------
export interface ApiError {
  timestamp?: string;
  status: number;
  error?: string;
  message: string;
  path?: string;
  validationErrors?: Record<string, string>;
}
