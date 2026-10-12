import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-white/10 text-brass" : "text-white/80 hover:text-white"
  }`;

export default function Navbar() {
  const { user, isAdmin, isCustomer, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Role-based navigation
  const links = [
    { to: "/", label: "Movies", end: true },
    { to: "/shows", label: "Shows" },
    { to: "/theatres", label: "Theatres" },
    ...(isCustomer ? [{ to: "/bookings", label: "My bookings" }] : []),
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  const handleSignOut = () => {
    signOut();
    setOpen(false);
    navigate("/signin");
  };

  return (
    <header className="sticky top-0 z-30 bg-ink text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
          <span className="font-display text-xl font-extrabold tracking-tight">Reel Seat</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <NavLink to="/profile" className={linkClass}>
                {user.name.split(" ")[0]}
              </NavLink>
              <button onClick={handleSignOut} className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:text-white">
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={linkClass}>
                Sign in
              </NavLink>
              <Link to="/signup" className="btn bg-brass text-ink hover:bg-brass/90">
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-white md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                  Profile
                </NavLink>
                <button onClick={handleSignOut} className="rounded-md px-3 py-2 text-left text-sm font-medium text-white/80">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/signin" className={linkClass} onClick={() => setOpen(false)}>
                  Sign in
                </NavLink>
                <NavLink to="/signup" className={linkClass} onClick={() => setOpen(false)}>
                  Create account
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
