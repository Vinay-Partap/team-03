import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import CitizenLayout from "../layouts/CitizenLayout";
import GovernmentLayout from "../layouts/GovernmentLayout";

import LandingPage from "../pages/landing/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import CitizenDashboard from "../pages/citizen/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import GovernmentDashboard from "../pages/government/Dashboard";
import GovernmentReports from "../pages/government/Reports";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}

      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth */}

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Citizen */}

      <Route element={<CitizenLayout />}>
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
      </Route>

      {/* Admin */}

      <Route element={<GovernmentLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Government */}

      <Route element={<GovernmentLayout />}>
        <Route path="/government" element={<GovernmentDashboard />} />
        <Route path="/government/dashboard" element={<GovernmentDashboard />} />
        <Route path="/government/reports" element={<GovernmentReports />} />
      </Route>

    </Routes>
  );
}
