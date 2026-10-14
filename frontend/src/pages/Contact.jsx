import { useState } from "react";
import { submitContactMessage } from "../services/api";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "sending", message: "Sending your message..." });

    try {
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        content: formData.message,
      });

      setStatus({ type: "success", message: "Your message has been sent successfully." });
      setFormData(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section className="px-4 py-10 sm:px-8">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-400">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Let&apos;s connect</h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            I&apos;m open to product work, internships, collaborations, and full-time opportunities.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Email</p>
              <a href="mailto:Ruba.Mohamed1012@gmail.com" className="mt-2 inline-block text-lg text-purple-300 hover:text-purple-200">
                Ruba.Mohamed1012@gmail.com
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">LinkedIn</p>
              <a href="https://www.linkedin.com/in/ruba-saleh-295309383" target="_blank" rel="noreferrer" className="mt-2 inline-block text-lg text-purple-300 hover:text-purple-200">
                linkedin.com/in/ruba-saleh-295309383
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">GitHub</p>
              <a href="https://github.com/1rubasaleh" target="_blank" rel="noreferrer" className="mt-2 inline-block text-lg text-purple-300 hover:text-purple-200">
                github.com/1rubasaleh
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm text-slate-300 sm:col-span-1">
              Name
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
              />
            </label>

            <label className="block text-sm text-slate-300 sm:col-span-1">
              Email
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm text-slate-300">
            Subject
            <input
              type="text"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
            />
          </label>

          <label className="mt-5 block text-sm text-slate-300">
            Message
            <textarea
              name="message"
              required
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
            />
          </label>

          {status.message && (
            <p className={`mt-5 text-sm ${status.type === "error" ? "text-red-400" : "text-emerald-400"}`}>
              {status.message}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 inline-flex rounded-full bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
