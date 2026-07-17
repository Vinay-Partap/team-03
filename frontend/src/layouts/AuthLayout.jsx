import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center font-['Inter'] bg-[#f8fafc] p-4">
      <Outlet />
    </div>
  );
}