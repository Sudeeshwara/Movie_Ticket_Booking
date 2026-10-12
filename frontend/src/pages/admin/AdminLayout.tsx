import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { to: "/admin/movies", label: "Movies" },
  { to: "/admin/theatres", label: "Theatres" },
  { to: "/admin/shows", label: "Shows" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/users", label: "Users" },
];

export default function AdminLayout() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold sm:text-4xl">Admin</h1>
      <nav className="mt-4 mb-8 flex gap-1 overflow-x-auto border-b border-line" aria-label="Admin sections">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold ${
                isActive ? "border-velvet text-velvet" : "border-transparent text-muted hover:text-ink"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
