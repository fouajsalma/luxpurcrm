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
      <div className="flex items-center justify-center h-screen bg-[#0B1220] text-white">
        Chargement...
      </div>
    );
  }

  return (
    <div className="flex bg-[#0F172A] min-h-screen">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        <Navbar userName={user?.nom || user?.name || "Utilisateur"} />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}