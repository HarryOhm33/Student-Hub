// src/components/Protected/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      {" "}
      {/* Added pt-16 for navbar height */}
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {" "}
        {/* Added mt-4 for spacing */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
