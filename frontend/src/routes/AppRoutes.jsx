import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import CalendarPage from "../pages/CalendarPage";
import Leads from "../pages/Leads";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />


        {/* Dashboard layout wrapper for protected pages */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="leads" element={<Leads />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/register" />} />

      </Routes>
    </BrowserRouter>
  );
}