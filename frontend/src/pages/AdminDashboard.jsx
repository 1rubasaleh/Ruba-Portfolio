import { useCallback, useEffect, useMemo, useState } from "react";
import {
  adminRequest,
  fetchMessages,
  portfolioProjects,
} from "../services/api";

const field = (key, label, type = "text") => ({ key, label, type });

const sections = {
  projects: {
    title: "Featured projects",
    description:
      "Manage the two approved project cards. Their names stay fixed so the gallery remains limited to the verified projects.",
    route: "/projects",
    idKey: "ProjectId",
    fields: [
      field("description", "Description", "textarea"),
      field("imageUrl", "Screenshot URL", "url"),
      field("githubUrl", "GitHub URL", "url"),
      field("liveUrl", "Live demo URL", "url"),
    ],
  },
  skills: {
    title: "Skills",
    description: "Manage the skills shown in the public skills section.",
    route: "/skills",
    idKey: "SkillId",
    fields: [
      field("name", "Skill name"),
      field("categoryId", "Category", "category"),
      field("iconUrl", "Icon URL", "url"),
    ],
  },
  categories: {
    title: "Skill categories",
    description: "Create or rename the groups used to organize skills.",
    route: "/skill-categories",
    idKey: "CategoryId",
    fields: [field("categoryName", "Category name")],
  },
  profiles: {
    title: "Public profile",
    description:
      "Edit the profile content associated with this authenticated admin account.",
    route: "/profiles",
    idKey: "ProfileId",
    fields: [
      field("fullName", "Name"),
      field("title", "Professional title"),
      field("bio", "Biography", "textarea"),
      field("imageUrl", "Profile image URL", "url"),
      field("location", "Location"),
      field("cvUrl", "CV URL", "url"),
    ],
  },
  education: {
    title: "Education",
    description: "Manage education records shown in the portfolio.",
    route: "/education",
    idKey: "EducationId",
    fields: [
      field("profileId", "Profile", "profile"),
      field("institution", "Institution"),
      field("degree", "Degree"),
      field("fieldOfStudy", "Field of study"),
      field("startDate", "Start date", "date"),
      field("endDate", "End date", "date"),
      field("description", "Description", "textarea"),
    ],
  },
  experience: {
    title: "Experience",
    description: "Manage professional experience records shown in the portfolio.",
    route: "/experience",
    idKey: "ExperienceId",
    fields: [
      field("profileId", "Profile", "profile"),
      field("companyName", "Organization"),
      field("position", "Position"),
      field("startDate", "Start date", "date"),
      field("endDate", "End date", "date"),
      field("description", "Description", "textarea"),
    ],
  },
};

const tabs = [
  ["projects", "Projects"],
  ["skills", "Skills"],
  ["categories", "Skill categories"],
  ["profiles", "Profile"],
  ["education", "Education"],
  ["experience", "Experience"],
  ["messages", "Messages"],
];

const displayValue = (item, key) => {
  const value = item[key] ?? item[`${key[0].toUpperCase()}${key.slice(1)}`];
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return value.slice(0, 10);
  }
  return String(value);
};

function RecordEditor({
  sectionKey,
  records,
  categories,
  profiles,
  onSaved,
  onDeleted,
  onFailure,
}) {
  const config = sections[sectionKey];
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState({});
  const [busy, setBusy] = useState(false);

  const beginEdit = (record) => {
    setSelectedId(String(record?.[config.idKey] ?? ""));
    setDraft(
      record
        ? Object.fromEntries(
            config.fields.map(({ key }) => [key, displayValue(record, key)]),
          )
        : {},
    );
  };

  const makePayload = () =>
    Object.fromEntries(
      config.fields.map(({ key, type }) => {
        const value = draft[key] ?? "";
        return [key, type === "number" || type === "category" || type === "profile"
          ? (value === "" ? null : Number(value))
          : value.trim()];
      }),
    );

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const editing = Boolean(selectedId);
      const result = await adminRequest(
        editing ? `${config.route}/${selectedId}` : config.route,
        editing ? "PUT" : "POST",
        makePayload(),
      );
      await onSaved(result, editing ? selectedId : "");
      beginEdit(null);
    } catch (error) {
      onFailure(error.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (record) => {
    const id = record[config.idKey];
    if (!window.confirm(`Delete this ${config.title.toLowerCase()} record?`)) {
      return;
    }
    setBusy(true);
    try {
      await adminRequest(`${config.route}/${id}`, "DELETE");
      await onDeleted(String(id));
      if (selectedId === String(id)) beginEdit(null);
    } catch (error) {
      onFailure(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
      <div className="space-y-3">
        {records.length === 0 ? (
          <p className="rounded-2xl border border-slate-800 p-5 text-sm text-slate-400">
            No records yet. Use the form to add one.
          </p>
        ) : (
          records.map((record) => {
            const id = String(record[config.idKey]);
            const titleField = config.fields.find(
              ({ key }) => key !== "profileId",
            )?.key;
            const title = displayValue(record, titleField) || `Record ${id}`;
            return (
              <article
                key={id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-white">{title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                    {displayValue(record, config.fields[1]?.key)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => beginEdit(record)}
                    className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-purple-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => remove(record)}
                    className="rounded-full border border-red-900 px-4 py-2 text-sm text-red-300 hover:border-red-500 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      <form
        onSubmit={save}
        className="h-fit space-y-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-5"
      >
        <h3 className="text-lg font-semibold text-white">
          {selectedId ? "Edit record" : "Add record"}
        </h3>
        {config.fields.map(({ key, label, type }) => {
          const options =
            type === "category"
              ? categories.map((item) => ({
                  value: item.CategoryId,
                  label: item.CategoryName,
                }))
              : type === "profile"
                ? profiles.map((item) => ({
                    value: item.ProfileId,
                    label: item.FullName || `Profile ${item.ProfileId}`,
                  }))
                : [];
          return (
            <label key={key} className="block text-sm text-slate-300">
              <span className="mb-1.5 block">{label}</span>
              {type === "textarea" ? (
                <textarea
                  required={key !== "description"}
                  rows={4}
                  value={draft[key] ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-purple-500"
                />
              ) : type === "category" || type === "profile" ? (
                <select
                  required
                  value={draft[key] ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-purple-500"
                >
                  <option value="">
                    {options.length ? "Choose one" : "Create a profile/category first"}
                  </option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required={type !== "url" && type !== "date"}
                  type={type}
                  value={draft[key] ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-purple-500"
                />
              )}
            </label>
          );
        })}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50"
          >
            {busy ? "Saving…" : selectedId ? "Save changes" : "Create"}
          </button>
          {selectedId && (
            <button
              type="button"
              onClick={() => beginEdit(null)}
              className="rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState({});
  const [activeTab, setActiveTab] = useState("projects");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [
        projects,
        skills,
        categories,
        profiles,
        education,
        experience,
        messages,
      ] = await Promise.all([
        adminRequest("/projects"),
        adminRequest("/skills"),
        adminRequest("/skill-categories"),
        adminRequest("/profiles"),
        adminRequest("/education"),
        adminRequest("/experience"),
        fetchMessages(),
      ]);
      setData({
        projects,
        skills,
        categories,
        profiles,
        education,
        experience,
        messages,
      });
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadData, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadData]);

  const profiles = useMemo(() => data.profiles || [], [data.profiles]);
  const onFailure = (message) => {
    setNotice("");
    setError(message);
  };
  const updateList = (key, transform, message) => {
    setData((current) => ({
      ...current,
      [key]: transform(current[key] || []),
    }));
    setError("");
    setNotice(message);
  };

  const saveRecord = (key, idKey, result, oldId, message) => {
    updateList(
      key,
      (records) => {
        const returnedId = result?.[idKey];
        const index = records.findIndex(
          (record) => String(record[idKey]) === String(oldId || returnedId),
        );
        if (index < 0) return [...records, result];
        return records.map((record, currentIndex) =>
          currentIndex === index ? result : record,
        );
      },
      message,
    );
  };

  const projectRecords = useMemo(
    () =>
      portfolioProjects
        .map((project) =>
          (data.projects || []).find(
            (record) =>
              record.Title?.toLowerCase() === project.title.toLowerCase() ||
              record.GitHubUrl?.toLowerCase() === project.githubUrl.toLowerCase(),
          ),
        )
        .filter(Boolean),
    [data.projects],
  );

  const saveProject = async (project, record) => {
    setError("");
    setNotice("");
    try {
      const payload = {
        title: project.title,
        description: record.description,
        imageUrl: record.imageUrl,
        githubUrl: record.githubUrl,
        liveUrl: record.liveUrl,
      };
      const existing = (data.projects || []).find(
        (item) =>
          item.Title?.toLowerCase() === project.title.toLowerCase() ||
          item.GitHubUrl?.toLowerCase() === project.githubUrl.toLowerCase(),
      );
      const result = await adminRequest(
        existing ? `/projects/${existing.ProjectId}` : "/projects",
        existing ? "PUT" : "POST",
        payload,
      );
      setData((current) => ({
        ...current,
        projects: existing
          ? current.projects.map((item) =>
              item.ProjectId === existing.ProjectId ? result : item,
            )
          : [...current.projects, result],
      }));
      setNotice(`${project.title} saved successfully.`);
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  const panelItems = data[activeTab] || [];

  return (
    <section className="px-4 py-10 sm:px-8">
      <div className="section-shell">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-400">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Dashboard</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Manage portfolio content and contact messages. Changes are saved
            through the authenticated API. Account roles and user management
            are intentionally not exposed here.
          </p>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2" role="tablist">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => {
                setActiveTab(key);
                setNotice("");
                setError("");
              }}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium ${
                activeTab === key
                  ? "bg-purple-600 text-white"
                  : "border border-slate-700 text-slate-300 hover:border-purple-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-4 rounded-xl border border-emerald-900 bg-emerald-950/40 p-4 text-sm text-emerald-200">
            {notice}
          </p>
        )}

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {activeTab === "messages" ? "Contact messages" : sections[activeTab].title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {activeTab === "messages"
                ? "Read incoming messages, mark them as read, or remove them."
                : sections[activeTab].description}
            </p>
          </div>

          {loading ? (
            <p role="status" className="text-sm text-slate-300">Loading management data…</p>
          ) : activeTab === "messages" ? (
            <div className="space-y-3">
              {panelItems.length === 0 ? (
                <p className="rounded-2xl border border-slate-800 p-5 text-sm text-slate-400">
                  No contact messages.
                </p>
              ) : (
                panelItems.map((message) => (
                  <article key={message.MessageId} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white">{message.Subject}</h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {message.Name} · {message.Email}
                        </p>
                      </div>
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                        {message.IsRead ? "Read" : "Unread"}
                      </span>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                      {message.Content}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const result = await adminRequest(
                              `/messages/${message.MessageId}`,
                              "PUT",
                              {
                                name: message.Name,
                                email: message.Email,
                                subject: message.Subject,
                                content: message.Content,
                                isRead: !message.IsRead,
                              },
                            );
                            saveRecord("messages", "MessageId", result, message.MessageId, "Message status updated.");
                          } catch (messageError) {
                            onFailure(messageError.message);
                          }
                        }}
                        className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-purple-500"
                      >
                        Mark as {message.IsRead ? "unread" : "read"}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm("Delete this contact message?")) return;
                          try {
                            await adminRequest(`/messages/${message.MessageId}`, "DELETE");
                            updateList("messages", (items) => items.filter((item) => item.MessageId !== message.MessageId), "Message deleted.");
                          } catch (messageError) {
                            onFailure(messageError.message);
                          }
                        }}
                        className="rounded-full border border-red-900 px-4 py-2 text-sm text-red-300 hover:border-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          ) : activeTab === "projects" ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {portfolioProjects.map((project) => {
                const record = projectRecords.find(
                  (item) =>
                    item.Title?.toLowerCase() === project.title.toLowerCase() ||
                    item.GitHubUrl?.toLowerCase() === project.githubUrl.toLowerCase(),
                );
                const values = record
                  ? {
                      description: record.Description || project.description,
                      imageUrl: record.ImageUrl || project.imageUrl,
                      githubUrl: record.GitHubUrl || project.githubUrl,
                      liveUrl: record.LiveUrl || project.liveUrl,
                    }
                  : {
                      description: project.description,
                      imageUrl: project.imageUrl,
                      githubUrl: project.githubUrl,
                      liveUrl: project.liveUrl,
                    };
                return (
                  <ProjectEditor
                    key={project.id}
                    project={project}
                    initialValues={values}
                    onSave={(updated) => saveProject(project, updated)}
                  />
                );
              })}
              <p className="text-sm leading-6 text-slate-400 lg:col-span-2">
                Project names and approved GitHub/demo destinations are kept
                consistent with the verified portfolio entries.
              </p>
            </div>
          ) : (
            <RecordEditor
              key={activeTab}
              sectionKey={activeTab}
              records={panelItems}
              categories={data.categories || []}
              profiles={profiles}
              onSaved={(result, oldId) => {
                const idKey = sections[activeTab].idKey;
                saveRecord(activeTab, idKey, result, oldId, `${sections[activeTab].title} saved successfully.`);
              }}
              onDeleted={(id) =>
                updateList(
                  activeTab,
                  (items) => items.filter((item) => String(item[sections[activeTab].idKey]) !== id),
                  `${sections[activeTab].title} record deleted.`,
                )
              }
              onFailure={onFailure}
            />
          )}

          <button
            type="button"
            onClick={loadData}
            className="mt-6 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-purple-500"
          >
            Refresh data
          </button>
        </section>
      </div>
    </section>
  );
}

function ProjectEditor({ project, initialValues, onSave }) {
  const [values, setValues] = useState(initialValues);
  const [busy, setBusy] = useState(false);
  const fields = [
    field("description", "Description", "textarea"),
    field("imageUrl", "Screenshot URL", "url"),
  ];
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        try {
          await onSave(values);
        } finally {
          setBusy(false);
        }
      }}
      className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-5"
    >
      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
      {fields.map(({ key, label, type }) => (
        <label key={key} className="block text-sm text-slate-300">
          <span className="mb-1.5 block">{label}</span>
          {type === "textarea" ? (
            <textarea
              rows={4}
              value={values[key] || ""}
              onChange={(event) =>
                setValues((current) => ({ ...current, [key]: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-purple-500"
            />
          ) : (
            <input
              type="url"
              value={values[key] || ""}
              onChange={(event) =>
                setValues((current) => ({ ...current, [key]: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-purple-500"
            />
          )}
        </label>
      ))}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save project"}
      </button>
    </form>
  );
}
