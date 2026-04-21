import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer vos informations.");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (loading) {
    return <div className="home-container"><div className="loading">Chargement...</div></div>;
  }

  if (error) {
    return <div className="home-container"><div className="error">{error}</div></div>;
  }

  return (
    <div className="home-container">
      {/* Barre de navigation */}
      <nav className="home-nav">
        <span className="nav-logo">Luxpure CRM</span>
        <div className="nav-right">
          {user && (
            <span className="user-name">{user.nom} {user.prenom}</span>
          )}
          <button onClick={handleLogout} className="logout-btn">
            Sign out 
          </button>
        </div>
      </nav>

      {/* Box avec les 4 items */}
      <div className="home-box">
        <div className="home-item">
           <img src="/calendrier.png"  className="item-icon" />
          <span>Calendrier</span>
        </div>
        <div className="home-item">
          <img src="/contact.png" alt="Contact" className="item-icon" />
          <span>Contact</span>
        </div>
        <div className="home-item">
          <img src="/odoo-crm.png" alt="CRM" className="item-icon" />
          <span>CRM</span>
        </div>
        <div className="home-item">
          <img src="/dashboard.png" alt="Tableau de bord" className="item-icon" />
          <span>Tableau de bord</span>
        </div>
      </div>
    </div>
  );
}