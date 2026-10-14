import { useEffect, useState } from "react";
import { fallbackSkills, fetchSkills } from "../services/api";

export default function Skills() {
  const [categories, setCategories] = useState(fallbackSkills);
  const [skillsWarning, setSkillsWarning] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSkills = async () => {
      try {
        const data = await fetchSkills();
        if (isMounted) {
          setCategories(data);
        }
      } catch {
        if (isMounted) {
          setSkillsWarning(
            "Live skills data could not be loaded. Showing your confirmed skills.",
          );
        }
      }
    };

    loadSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="px-4 py-10 sm:px-8">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-400">Skills</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Technical toolkit</h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Technologies and tools I have worked with or am learning through training and hands-on projects.
          </p>
        </div>

        {skillsWarning && (
          <p role="status" className="mt-5 text-sm text-amber-200">
            {skillsWarning}
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((group) => (
            <div key={group.category} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-xl font-semibold text-white">{group.category}</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {(group.items || []).map((item) => (
                  <span key={item} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
