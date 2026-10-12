# Reel Seat — Movie Ticket Booking System (Frontend)

CMJD 114/115 · Assignment 2 — Front End Development with React

A React + TypeScript single-page application that works with the Spring Boot **Movie Ticket Booking System** backend (Assignment 1). It supports user authentication, movie / theatre / show browsing, seat selection, booking management and payment processing, with a responsive interface.

## Technologies Used

- React 19 with TypeScript (Vite)
- React Router 7
- Axios
- Tailwind CSS 4
- State management: `useState`, `useEffect` and the Context API (`AuthContext`, `ToastContext`)

## Prerequisites

- Node.js 18+ and npm
- The backend running on `http://localhost:8080` (see `../backend/README.md`)

## Setup and Run

```bash
cd frontend
cp .env.example .env        # adjust the API URL if needed
npm install
npm run dev                 # http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview
```

### Environment variables

| Variable            | Default                      | Description               |
|---------------------|------------------------------|---------------------------|
| `VITE_API_BASE_URL` | `http://localhost:8080/api`  | Base URL of the backend API |

The backend allows CORS from `http://localhost:5173`.

## Default Accounts

| Role     | Email             | Password   |
|----------|-------------------|------------|
| ADMIN    | admin@cinema.lk   | admin123   |
| CUSTOMER | register via **Sign Up** |     |

## Features

### Authentication
- Sign-In and Sign-Up pages with client-side form validation.
- JWT returned by the backend is attached to every request by an Axios interceptor.
- The token is kept in `localStorage`, its expiry is checked on load, and it is cleared automatically when the backend returns `401`.

### Navigation
- Navigation bar with links that change by role (guest / CUSTOMER / ADMIN).
- Routes configured with React Router; protected routes are guarded by role (`ProtectedRoute`).

### Customer
- Browse movies with search (title) and filters (genre, language, status); view movie details and its shows.
- Browse theatres.
- Browse shows filtered by movie, theatre and date, with ticket price and show information.
- Seat selection on a seat map (booked seats are disabled), showing the selected seats, number of tickets and total amount.
- Submit bookings, view booking history and booking details, cancel eligible bookings.
- Make payments (CARD / CASH / ONLINE_TRANSFER) and view payment information and status; failed payments can be retried.
- Update own profile.

### Admin
- Manage movies, theatres and shows (create, update, delete).
- View all bookings and update booking status.
- View payment information.
- Manage users (view, update, delete).

### Feedback, loading and errors
- Loading spinners, empty states and error states on every data view.
- Toast notifications for successful and failed operations; backend validation messages are shown on forms.

### Demo payment cards
The payment is simulated (no real gateway):
- `4242 4242 4242 4242` → payment succeeds, booking becomes **CONFIRMED**
- `4000 0000 0000 0002` → payment fails, booking stays **PENDING** (can retry)
- Any expiry in the future and any 3–4 digit CVV (MM/YY expiry).

## Routes

| Path                   | Access    | Page                       |
|------------------------|-----------|----------------------------|
| `/`                    | Public    | Movies                     |
| `/movies/:id`          | Public    | Movie details + shows      |
| `/shows`               | Public    | Shows (filter by movie/theatre/date) |
| `/theatres`            | Public    | Theatres                   |
| `/signin`, `/signup`   | Public    | Authentication             |
| `/shows/:id/book`      | CUSTOMER  | Seat selection & booking   |
| `/bookings`            | CUSTOMER  | My bookings                |
| `/bookings/:id/pay`    | CUSTOMER  | Payment                    |
| `/bookings/:id`        | Signed in | Booking & payment details  |
| `/profile`             | Signed in | Profile                    |
| `/admin/*`             | ADMIN     | Movies, Theatres, Shows, Bookings, Payments, Users |

## Project Structure

```
src/
├── api/            # Axios client + one service per backend resource
├── components/
│   ├── common/     # Navbar, ProtectedRoute, Modal, Spinner, form fields, badges…
│   ├── movie/      # MovieCard, MoviePoster, MovieFilters, MovieForm
│   ├── theatre/    # TheatreCard, TheatreForm
│   ├── show/       # ShowCard, ShowFilters, ShowForm
│   ├── booking/    # SeatMap, TicketSummary, BookingCard
│   ├── payment/    # PaymentForm, PaymentDetails
│   └── user/       # ProfileForm
├── context/        # AuthContext, ToastContext
├── hooks/          # useApi (loading / error / data state)
├── pages/          # Route pages (auth/, admin/, customer pages)
├── types/          # Shared TypeScript types matching backend DTOs
├── utils/          # Token storage, validation, formatting, seat helpers
├── App.tsx         # Routing
└── main.tsx        # Entry point with providers
```

## Future Expansion – Student Proposal

1. **Movie reviews and ratings** — A rating widget and review list on the movie details page, plus an average-rating badge on movie cards. Customers could judge a movie before booking, and ratings could be used to sort and highlight popular movies.
2. **Discount and promotional code interface** — A promo-code field on the payment page that validates the code against the backend and shows the discounted total before payment. This makes offers visible at the point of decision and gives clear feedback when a code is invalid or expired.
3. **Booking and revenue dashboard** — An admin dashboard with charts for bookings per day, revenue per movie/theatre and seat occupancy per show, helping administrators plan show times and pricing without reading raw tables.

## Version Control

The source code is maintained on GitHub. Submit the repository URL:

```bash
git init
git add .
git commit -m "Movie Ticket Booking System frontend"
git branch -M main
git remote add origin https://github.com/<username>/<repository>.git
git push -u origin main
```
