import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/authantificaion/Register";
import Login from "../pages/authantificaion/Login";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import CalendarPage from "../pages/CalendarPage";
import ClientList from "../pages/Clients/Clients";
import ClientDetails from "../pages/Clients/ClientDetails";
import ClientForm from "../pages/Clients/ClientForm";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/home/clients" />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="clients/:id/edit" element={<ClientForm />} />
          <Route path="clients/:id" element={<ClientDetails />} />
          <Route
            path="payments"
            element={
              <div className="dashboard-placeholder">
                <h2>Paiements</h2>
                <p>Section Paiements à venir.</p>
              </div>
            }
          />
          <Route
            path="subscriptions"
            element={
              <div className="dashboard-placeholder">
                <h2>Abonnements</h2>
                <p>Section Abonnements à venir.</p>
              </div>
            }
          />
          <Route
            path="tickets"
            element={
              <div className="dashboard-placeholder">
                <h2>Tickets</h2>
                <p>Section Tickets à venir.</p>
              </div>
            }
          />
          <Route
            path="taxes"
            element={
              <div className="dashboard-placeholder">
                <h2>Taxes</h2>
                <p>Section Taxes à venir.</p>
              </div>
            }
          />
          <Route
            path="settings"
            element={
              <div className="dashboard-placeholder">
                <h2>Paramètres</h2>
                <p>Section Paramètres à venir.</p>
              </div>
            }
          />
        </Route>

        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <CalendarPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </BrowserRouter>
  );
}
