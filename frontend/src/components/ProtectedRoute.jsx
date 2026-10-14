import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoading, authError, refreshUser } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <p role="status" className="text-sm text-slate-300">
          Verifying your account…
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="max-w-lg rounded-3xl border border-slate-800 bg-slate-900/70 p-7 text-center">
          <h1 className="text-2xl font-semibold text-white">
            {authError ? "Account could not be verified" : "Login required"}
          </h1>
          <p role={authError ? "alert" : undefined} className="mt-3 text-sm leading-6 text-slate-300">
            {authError ||
              "Sign in with an authorized account to open this page."}
          </p>
          {authError ? (
            <button
              type="button"
              onClick={refreshUser}
              className="mt-5 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-500"
            >
              Try again
            </button>
          ) : (
            <Navigate to="/login" replace />
          )}
        </div>
      </section>
    );
  }

  if (
    requiredRole &&
    String(user.roleName || "").toLowerCase() !== requiredRole.toLowerCase()
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
