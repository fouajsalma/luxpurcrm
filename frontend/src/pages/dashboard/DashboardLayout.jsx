import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }

    const loadUser = async () => {
      try {
        const response = await api.get("/me");
        setUser(response.data);
      } catch {
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-shell dashboard-loading">
        <div className="dashboard-loading-box">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <Sidebar onLogout={handleLogout} />
      <div className="dashboard-content">
        <Navbar userName={user?.nom || user?.name || "Utilisateur"} />
        <main className="dashboard-main">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}
