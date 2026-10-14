import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
