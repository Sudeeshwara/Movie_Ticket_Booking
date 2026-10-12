import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import TheatresPage from "./pages/TheatresPage";
import ShowsPage from "./pages/ShowsPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import PaymentPage from "./pages/PaymentPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminMoviesPage from "./pages/admin/AdminMoviesPage";
import AdminTheatresPage from "./pages/admin/AdminTheatresPage";
import AdminShowsPage from "./pages/admin/AdminShowsPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

/** Shared page shell: navigation bar + centred content column. */
function MainLayout() {
  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route index element={<MoviesPage />} />
          <Route path="movies/:id" element={<MovieDetailsPage />} />
          <Route path="shows" element={<ShowsPage />} />
          <Route path="theatres" element={<TheatresPage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />

          {/* Customer only */}
          <Route element={<ProtectedRoute roles={["CUSTOMER"]} />}>
            <Route path="shows/:id/book" element={<SeatSelectionPage />} />
            <Route path="bookings" element={<MyBookingsPage />} />
            <Route path="bookings/:id/pay" element={<PaymentPage />} />
          </Route>

          {/* Any signed-in user */}
          <Route element={<ProtectedRoute />}>
            <Route path="bookings/:id" element={<BookingDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/movies" replace />} />
              <Route path="movies" element={<AdminMoviesPage />} />
              <Route path="theatres" element={<AdminTheatresPage />} />
              <Route path="shows" element={<AdminShowsPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
