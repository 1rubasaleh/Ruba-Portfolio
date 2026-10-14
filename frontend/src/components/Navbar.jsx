import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const isAuthenticated = Boolean(user);
  const isAdmin =
    String(user?.roleName || "").toLowerCase() === "admin";

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/skills", label: "Skills" },
    { to: "/projects", label: "Projects" },
    { to: "/contact", label: "Contact" },
  ];

  const authLinks = [
    { to: "/favorites", label: "Favorites" },
    { to: "/profile", label: "Profile" },
  ];

  const navContent = (
    <>
      {publicLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={() => setIsOpen(false)}
          className="text-sm font-medium text-gray-300 transition-colors hover:text-purple-400"
        >
          {link.label}
        </Link>
      ))}

      {isAuthenticated ? (
        <>
          {authLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-300 transition-colors hover:text-purple-400"
            >
              {link.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-gray-300 transition-colors hover:text-purple-400"
            >
              Admin Dashboard
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-gray-300 transition-colors hover:text-purple-400"
          >
            Logout
          </button>
        </>
      ) : !isLoading ? (
        <>
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium text-gray-300 transition-colors hover:text-purple-400"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={() => setIsOpen(false)}
            className="rounded-full bg-purple-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-purple-500"
          >
            Register
          </Link>
        </>
      ) : null}
    </>
  );

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
        <Link to="/" className="text-lg font-semibold text-white">
          <span className="font-['Dancing_Script'] text-2xl">Ruba</span>
          <span className="font-['Dancing_Script'] text-2xl text-purple-400">Saleh</span>
        </Link>

        <div className="relative sm:hidden">
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="text-xl text-gray-200"
            aria-label="Toggle menu"
          >
            ☰
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 w-52 rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-2xl shadow-slate-950/50">
              <div className="flex flex-col gap-3">{navContent}</div>
            </div>
          )}
        </div>

        <div className="hidden items-center gap-6 sm:flex">{navContent}</div>
      </div>
    </nav>
  );
}
