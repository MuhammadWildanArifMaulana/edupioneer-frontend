import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ErrorBoundary from "../components/ErrorBoundary";

export default function DashboardLayout({
  role = "siswa",
  user = {
    name: "Satria Mahesa",
    role: "Siswa",
    avatar: null,
  },
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="
        min-h-screen w-full
        bg-center bg-cover
        bg-[url('/src/assets/Images/BackgroundBeranda.webp')]
      "
    >
      <Navbar
        userName={user?.name}
        userRole={user?.role}
        userAvatar={user?.avatar}
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={role}
      />

      <div className="pt-16 px-6 pb-10 min-h-screen">
        <div
          className={`
            pt-6 transition-all duration-300
            ${sidebarOpen ? "lg:ml-[264px]" : "lg:ml-20"}
          `}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
