import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fallbackProjects,
  fallbackSkills,
  fetchProfiles,
  fetchProjects,
  fetchSkills,
} from "../services/api";

export default function Home() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [skills, setSkills] = useState(fallbackSkills);
  const [profile, setProfile] = useState(null);
  const [contentWarning, setContentWarning] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      const [projectResult, skillResult, profileResult] = await Promise.allSettled([
        fetchProjects(),
        fetchSkills(),
        fetchProfiles(),
      ]);

      if (!isMounted) {
        return;
      }

      let hasUnavailableContent = false;

      if (projectResult.status === "fulfilled") {
        setProjects(projectResult.value);
      } else {
        hasUnavailableContent = true;
      }

      if (skillResult.status === "fulfilled") {
        setSkills(skillResult.value);
      } else {
        hasUnavailableContent = true;
      }

      if (profileResult.status === "fulfilled" && profileResult.value.length > 0) {
        setProfile(profileResult.value[0]);
      } else if (profileResult.status === "rejected") {
        hasUnavailableContent = true;
      }

      if (hasUnavailableContent) {
        setContentWarning(
          "Some live portfolio content could not be loaded. Showing verified portfolio details.",
        );
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="px-4 py-20 sm:px-8">
        <div className="section-shell hero-animation text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-purple-400">
            Computer Engineering · Full-stack development
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-7xl">
            Hi, I&apos;m {profile?.FullName || "Ruba Saleh"}
          </h1>
          <h2 className="mt-4 text-lg font-medium text-slate-200 sm:text-2xl md:text-3xl">
            {profile?.Title || "Computer Engineering Graduate | Full-Stack Developer"}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300">
            {profile?.Bio ||
              "I enjoy building practical web applications, from thoughtful frontend experiences to backend services, APIs, and databases. I am continuing to grow through hands-on projects and technical learning."}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/projects"
              className="rounded-full bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500"
            >
              View My Projects
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-purple-500 hover:text-purple-300"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </section>

      {contentWarning && (
        <p
          role="status"
          className="section-shell mx-auto px-4 pb-4 text-sm text-amber-200 sm:px-8"
        >
          {contentWarning}
        </p>
      )}

      <section className="px-4 py-10 sm:px-8">
        <div className="section-shell">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-purple-400">
                Selected work
              </p>
              <h3 className="mt-2 text-3xl font-semibold text-white">
                Projects
              </h3>
            </div>
            <Link
              to="/projects"
              className="text-sm font-medium text-purple-300 hover:text-purple-200"
            >
              See both projects →
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-slate-950/40"
              >
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={`${project.title} screenshot`}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className={`flex h-48 items-end justify-between bg-gradient-to-br p-6 ${
                      index === 0
                        ? "from-emerald-900/70 via-slate-800 to-slate-950"
                        : "from-sky-900/70 via-slate-800 to-slate-950"
                    }`}
                  >
                    <span className="text-sm uppercase tracking-[0.2em] text-slate-300">
                      {project.category}
                    </span>
                    <span className="text-4xl font-light text-white/80">
                      0{index + 1}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h4 className="text-xl font-semibold text-white">
                    {project.title}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
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
                    {project.slug === "spotter-trip-planner" && (
                      <Link
                        to="/projects#spotter-trip-planner"
                        className="self-center text-sm font-medium text-purple-300 hover:text-purple-200"
                      >
                        Project details
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-8">
        <div className="section-shell">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-purple-400">
                Skills in progress
              </p>
              <h3 className="mt-2 text-3xl font-semibold text-white">
                My technical toolkit
              </h3>
            </div>
            <Link
              to="/skills"
              className="text-sm font-medium text-purple-300 hover:text-purple-200"
            >
              View skills →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {skills.map((group) => (
              <div
                key={group.category}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5"
              >
                <h4 className="text-lg font-semibold text-white">
                  {group.category}
                </h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-8">
        <div className="section-shell grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-purple-400">
              About me
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-white">
              Engineering foundations, practical web development
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-300">
              I graduated with a Bachelor&apos;s degree in Computer Engineering
              from Tafila Technical University in 2025. I am interested in
              frontend, full-stack, and backend development, and enjoy
              connecting interfaces to APIs and databases.
            </p>
            <Link
              to="/about"
              className="mt-5 inline-block text-sm font-medium text-purple-300 hover:text-purple-200"
            >
              More about my background →
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-purple-400">
              Academic engineering project
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Fire Alarm Detection System
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              A Computer Engineering graduation project using fire and heat
              sensors, microcontroller-based control, water-pump activation,
              and sensor-data communication through Telegram and USB.
            </p>
            <Link
              to="/projects#academic-engineering-project"
              className="mt-5 inline-block text-sm font-medium text-purple-300 hover:text-purple-200"
            >
              Read about the academic project →
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 pb-20 sm:px-8">
        <div className="section-shell text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-400">
            Let&apos;s connect
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-white">
            Open to learning, collaboration, and opportunities
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
            If you would like to discuss a project or an opportunity, I would
            be happy to hear from you.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-full bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-500"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
