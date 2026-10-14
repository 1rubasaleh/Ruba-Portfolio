import { useAuth } from "../contexts/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const userRole = String(user?.roleName || "user");

  return (
    <section className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-slate-950/30 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-purple-400">Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{user?.name}</h1>
          </div>

          <div className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
            {userRole}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Contact</p>
            <p className="mt-4 text-lg text-white">{user?.email}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Role</p>
            <p className="mt-4 text-lg text-white">{userRole}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Overview</p>
          <p className="mt-4 text-base leading-7 text-gray-300">
            I build practical digital experiences that combine front-end elegance with reliable backend architecture.
            This profile is meant for a personal portfolio and can be extended with detailed biography, work history,
            and editable account information.
          </p>
        </div>
      </div>
    </section>
  );
}
