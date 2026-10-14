import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../services/api";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await registerUser(formData);
      const createdUser = response?.user;
      if (!createdUser?.UserId && !createdUser?.userId) {
        throw new Error(
          "The server did not confirm that an account was created.",
        );
      }
      setSuccess(
        "Your account was created successfully. You can now log in.",
      );
      setFormData({ name: "", email: "", password: "" });
    } catch (registerError) {
      setError(
        registerError.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-purple-400">Create account</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Register</h1>
        </div>

        {success ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-200"
          >
            <p>{success}</p>
            <Link
              to="/login"
              className="mt-3 inline-block font-medium text-emerald-100 underline underline-offset-4"
            >
              Continue to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-500"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? {" "}
          <Link to="/login" className="text-purple-400 hover:text-purple-300">
            Login
          </Link>
        </p>

        <Link to="/" className="mt-5 flex justify-center text-sm text-slate-400 hover:text-purple-300">
          ← Back to Home
        </Link>
      </div>
    </section>
  );
}
