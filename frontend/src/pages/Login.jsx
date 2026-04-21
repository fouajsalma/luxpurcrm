import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Connexion réussie !");
      navigate("/home");
    } catch (err) {
      console.error(err.response?.data);
      setError(
        err.response?.data?.message || "Email ou mot de passe incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-container">
      {/* Partie gauche : texte d'accueil */}
      <div className="left-panel">
        <h1 className="welcome-title">Welcome!</h1>
        <p className="welcome-text">
          Gérez vos prospects, clients et collaborateurs depuis une plateforme unique.
          Suivez l'historique des échanges, planifiez des rendez-vous et analysez vos
          performances commerciales en temps réel.
        </p>
      </div>
    
      {/* Partie droite : formulaire */}
      <div className="right-panel">
        <div className="form-container">
          <h2>Sign in</h2>
          
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}