import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-slate-800">
      <div className="w-full px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-lg
        font-semibold"
        >
          <span className="font-['Dancing_Script']">Ruba</span>
          <span className="font-['Dancing_Script'] text-purple-500">Saleh</span>
        </div>

        {/* Mobile Button + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden text-gray-300 text-xl"
          >
            ☰
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-xl z-50 sm:hidden">
              <div className="flex flex-col gap-4">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
                >
                  About
                </Link>

                <Link
                  to="/skills"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Skills
                </Link>

                <Link
                  to="/projects"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Projects
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
          >
            About
          </Link>

          <Link
            to="/skills"
            className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
          >
            Skills
          </Link>

          <Link
            to="/projects"
            className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
          >
            Projects
          </Link>

          <Link
            to="/contact"
            className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
