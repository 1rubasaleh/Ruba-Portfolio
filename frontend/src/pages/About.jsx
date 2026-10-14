import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEducation, fetchExperiences, fetchProfiles } from "../services/api";

const interests = [
  "Frontend development",
  "Full-stack web development",
  "Backend development",
  "APIs and databases",
  "Continuous technical learning",
];

const learningExperience = [
  "Full-stack development training involving React and Node.js",
  "Training in C# and ASP.NET MVC",
  "Practical development of web application features",
  "Ongoing learning in data analysis and SQL",
];

export default function About() {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([fetchProfiles(), fetchEducation(), fetchExperiences()]).then(
      ([profilesResult, educationResult, experienceResult]) => {
        if (!isMounted) return;
        if (profilesResult.status === "fulfilled" && profilesResult.value.length) {
          setProfile(profilesResult.value[0]);
        }
        if (educationResult.status === "fulfilled") {
          setEducation(educationResult.value);
        }
        if (experienceResult.status === "fulfilled") {
          setExperience(experienceResult.value);
        }
      },
    );
    return () => {
      isMounted = false;
    };
  }, []);

  const primaryEducation = education[0];
  const fullName = profile?.FullName || "Ruba Saleh";

  return (
    <section className="px-4 py-10 sm:px-8">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-400">
            About
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
            {fullName}
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-200">
            {profile?.Bio ||
              "I am a Computer Engineering graduate interested in frontend and full-stack web development. I enjoy understanding how applications work, solving programming problems, designing interfaces, and connecting frontend experiences to backend services and databases."}
          </p>
          <p className="mt-4 text-base leading-7 text-slate-300">
            {profile?.Title ||
              "I continue to build my technical skills through hands-on projects and structured learning, with a focus on practical applications and maintainable code."}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.16em] text-purple-400">
              Education
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {primaryEducation
                ? `${primaryEducation.Degree || ""}${primaryEducation.FieldOfStudy ? ` in ${primaryEducation.FieldOfStudy}` : ""}`.trim()
                : "Bachelor's degree in Computer Engineering"}
            </h2>
            <p className="mt-3 text-base text-slate-200">
              {primaryEducation?.Institution || "Tafila Technical University"}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Graduation
                </dt>
                <dd className="mt-2 text-lg font-medium text-white">
                  {primaryEducation?.EndDate
                    ? String(primaryEducation.EndDate).slice(0, 4)
                    : "2025"}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Grade
                </dt>
                <dd className="mt-2 text-lg font-medium text-white">
                  Good
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-slate-400">
              {profile?.Location || "Based in Jordan"}
            </p>
          </section>

          {experience.length > 0 && (
            <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.16em] text-purple-400">
                Experience
              </p>
              <div className="mt-5 space-y-4">
                {experience.map((item) => (
                  <article
                    key={item.ExperienceId}
                    className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5"
                  >
                    <h2 className="text-xl font-semibold text-white">
                      {item.Position}
                    </h2>
                    <p className="mt-1 text-sm text-purple-300">
                      {item.CompanyName}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {item.Description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.16em] text-purple-400">
              Career interests
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Areas I am interested in
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <li
                  key={interest}
                  className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
                >
                  {interest}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.16em] text-purple-400">
            Training &amp; continued learning
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Learning through practice
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {learningExperience.map((experience) => (
              <li
                key={experience}
                className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300"
              >
                {experience}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/skills"
            className="rounded-full border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-purple-500 hover:text-purple-300"
          >
            Explore my skills
          </Link>
          <Link
            to="/projects#academic-engineering-project"
            className="rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500"
          >
            View academic project
          </Link>
        </div>
      </div>
    </section>
  );
}
