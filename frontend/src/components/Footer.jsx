export default function Footer() {
  return (
    <footer className="border-t border-slate-800">
      <div className="w-full px-4 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Copyright */}
        <p className="text-sm font-light text-gray-400">
          © 2026 Ruba Saleh. All rights reserved.
        </p>

        {/* Social Links */}
        <div className="flex gap-4">
          <a
            href="https://github.com/1rubasaleh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-light text-gray-400 hover:text-purple-400 transition-colors"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/ruba-saleh-295309383"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-light text-gray-400 hover:text-purple-400 transition-colors"
          >
            LinkedIn
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=Ruba.Mohamed1012@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-light text-gray-400 hover:text-purple-400 transition-colors"
          >
            Gmail
          </a>
        </div>
      </div>
    </footer>
  );
}
