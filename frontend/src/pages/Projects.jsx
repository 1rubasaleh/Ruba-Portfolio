import { useEffect, useMemo, useState } from "react";
import {
  fallbackProjects,
  fetchProjects,
  getStoredFavorites,
  setStoredFavorites,
} from "../services/api";
import { useLocation } from "react-router-dom";

const academicProject = {
  title: "Fire Alarm Detection System",
  description:
    "An academic engineering project developed as part of my Computer Engineering degree at Tafila Technical University.",
  concepts: [
    "Fire and heat sensors",
    "Microcontroller-based control",
    "Water-pump activation",
    "Sensor-data communication",
    "Telegram integration",
    "USB communication",
  ],
};

export default function Projects() {
  const { hash } = useLocation();
  const [projects, setProjects] = useState(fallbackProjects);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(getStoredFavorites);
  const [projectWarning, setProjectWarning] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        if (isMounted) {
          setProjects(data);
        }
      } catch {
        if (isMounted) {
          setProjectWarning(
            "Live project data could not be loaded. Showing the verified project information.",
          );
        }
      }
    };
    loadProjects();
    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hash) {
      return undefined;
    }

    const frameId = requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1));
      if (!target) {
        return;
      }

      if (hash === "#spotter-trip-planner") {
        const details = target.querySelector("details");
        if (details) {
          details.open = true;
        }
      }

      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => cancelAnimationFrame(frameId);
  }, [hash]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return projects;
    }

    return projects.filter((project) =>
      `${project.title} ${project.description} ${project.technologies.join(" ")}`
        .toLowerCase()
        .includes(query),
    );
  }, [projects, search]);

  const toggleFavorite = (project) => {
    const nextFavorites = favorites.some((item) => item.slug === project.slug)
      ? favorites.filter((item) => item.slug !== project.slug)
      : [...favorites, project];

    setStoredFavorites(nextFavorites);
    setFavorites(nextFavorites);
  };

  return (
    <section className="px-4 py-10 sm:px-8">
      <div className="section-shell">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-purple-400">
              Projects
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white">
              Selected software work
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Two projects showing my work across frontend development and
              full-stack application logic.
            </p>
          </div>

          <div className="w-full max-w-md">
            <label htmlFor="project-search" className="sr-only">
              Search projects
            </label>
            <input
              id="project-search"
              type="search"
              placeholder="Search these projects"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-full border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-500"
            />
          </div>
        </div>

        {projectWarning && (
          <p
            role="status"
            className="mt-5 text-sm text-amber-200"
          >
            {projectWarning}
          </p>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const saved = favorites.some(
                (item) => item.slug === project.slug,
              );

              return (
                <article
                  key={project.slug}
                  id={project.slug}
                  className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-slate-950/40"
                >
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={`${project.title} screenshot`}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className={`flex h-52 items-end justify-between p-6 ${
                        project.slug === "spotter-trip-planner"
                          ? "bg-gradient-to-br from-emerald-950 via-slate-800 to-slate-950"
                          : "bg-gradient-to-br from-sky-950 via-slate-800 to-slate-950"
                      }`}
                    >
                      <span className="text-sm uppercase tracking-[0.2em] text-slate-300">
                        {project.category}
                      </span>
                      <span className="text-5xl font-light text-white/80">
                        {project.slug === "spotter-trip-planner" ? "01" : "02"}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-purple-300">
                          {project.category}
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">
                          {project.title}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(project)}
                        aria-pressed={saved}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                          saved
                            ? "border border-purple-500/40 bg-purple-500/10 text-purple-200"
                            : "border border-slate-700 bg-slate-800 text-slate-200"
                        }`}
                      >
                        {saved ? "Saved" : "Save"}
                      </button>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-300">
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-200"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-purple-500 hover:text-purple-300"
                      >
                        GitHub
                      </a>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500"
                      >
                        Live Demo
                      </a>
                    </div>

                    {project.details && (
                      <details className="group mt-6 border-t border-slate-800 pt-5">
                        <summary className="cursor-pointer list-none text-sm font-medium text-purple-300 hover:text-purple-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400">
                          <span>Project details</span>
                          <span
                            aria-hidden="true"
                            className="ml-2 inline-block transition-transform group-open:rotate-90"
                          >
                            →
                          </span>
                        </summary>
                        <div className="mt-5 space-y-5">
                          <div>
                            <h3 className="text-sm font-semibold text-white">
                              Problem
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              {project.details.problem}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">
                              Implementation
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              {project.details.implementation}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">
                              Main features
                            </h3>
                            <ul className="mt-2 list-inside list-disc space-y-2 text-sm leading-6 text-slate-300 marker:text-purple-400">
                              {project.details.features.map((feature) => (
                                <li key={feature}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </details>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-300 lg:col-span-2">
              No projects match your search.
            </div>
          )}
        </div>

        <section
          id="academic-engineering-project"
          className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8"
          aria-labelledby="academic-project-heading"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-purple-400">
            Academic Engineering Project
          </p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <h2
                id="academic-project-heading"
                className="text-2xl font-semibold text-white"
              >
                {academicProject.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {academicProject.description}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                The system uses heat and fire sensors to detect potential fire
                conditions and activates a water pump to respond in the
                affected area.                 It also includes communication to send and receive sensor data
                using Telegram and USB. This project reflects my Computer Engineering
                background and experience bringing hardware and software
                together to solve a practical problem.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Engineering concepts
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {academicProject.concepts.map((concept) => (
                  <li
                    key={concept}
                    className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200"
                  >
                    {concept}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
