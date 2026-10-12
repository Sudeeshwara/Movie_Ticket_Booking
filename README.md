# Movie Ticket Booking System

CMJD 114/115 Coursework — IJSE

| Part                    | Folder                            | Stack                                                             |
| ----------------------- | --------------------------------- | ----------------------------------------------------------------- |
| Assignment 1 — Backend  | [`backend/`](backend/README.md)   | Spring Boot, Spring Data JPA, Spring Security + JWT, MySQL, Maven |
| Assignment 2 — Frontend | [`frontend/`](frontend/README.md) | React + TypeScript, React Router, Axios, Tailwind CSS             |

## Quick start

```bash
# 1. Backend (MySQL running, database settings in backend/src/main/resources/application.properties)
cd backend
mvn spring-boot:run            # http://localhost:8080

# 2. Frontend
cd frontend
cp .env.example .env
npm install
npm run dev                    # http://localhost:5173
```

Default admin: `admin@cinema.lk` / `admin123`

## Database

Run `database/movie_ticket_db.sql` in MySQL Workbench to create the `movie_ticket_db` database with all tables and sample data.

Sample logins: admin `admin@cinema.lk` / `admin123`,
customer `kasun@gmail.com` / `customer123`.
