import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
export default function PublicLayout() {
  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
