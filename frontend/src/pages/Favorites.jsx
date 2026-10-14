import { useState } from "react";
import { Link } from "react-router-dom";
import { getStoredFavorites, setStoredFavorites } from "../services/api";

export default function Favorites() {
  const [favorites, setFavorites] = useState(getStoredFavorites);

  const removeFavorite = (favoriteId) => {
    const nextFavorites = favorites.filter((item) => item.id !== favoriteId);
    setStoredFavorites(nextFavorites);
    setFavorites(nextFavorites);
  };

  if (favorites.length === 0) {
    return (
      <section className="px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-400">Saved projects</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">No favorites yet</h1>
          <p className="mt-3 text-gray-400">
            Save a project you like to keep it here for quick access later.
          </p>
          <Link to="/projects" className="mt-6 inline-block rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-500">
            Explore projects
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-400">Saved work</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Favorites</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((project) => (
            <article key={project.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/40">
              <div className="mb-5 h-40 rounded-2xl bg-gradient-to-br from-purple-500/30 via-slate-800 to-slate-950" />
              <h2 className="text-xl font-semibold text-white">{project.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-400">{project.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(project.technologies || []).slice(0, 3).map((tech) => (
                  <span key={tech} className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-gray-300">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <Link to="/projects" className="text-sm font-medium text-purple-400 hover:text-purple-300">
                  View details
                </Link>
                <button type="button" onClick={() => removeFavorite(project.id)} className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-red-500 hover:text-red-400">
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
