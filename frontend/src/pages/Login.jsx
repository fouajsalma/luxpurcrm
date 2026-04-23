import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
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
      setSuccess("Connexion réussie !");
      setTimeout(() => {
        navigate("/home");
      }, 1500);
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
    <div className="auth-container auth-page fade-in">

      <div className="auth-left slide-left">
        <h1>Welcome back</h1>
        <p>Connectez-vous et continuez à gérer vos leads.</p>
        {/* CARDS SECTION */}
        <div className="info-cards">

          <div className="info-card">
            <img src="/icons/analytics.png" />
            <h3>Accés rapide <br />
              Retrouvez vos données et vos leads en un clic. </h3>
          </div>

          <div className="info-card">
            <img src="/icons/security.png" />
            <h3>Collaboration d'équipe<br />
              Travaillez efficacement avec votre équipe.</h3>
          </div>
          <div className="info-card">
            <img src="/icons/automation.png" />
            <h3>
              Sécurité<br />
              Nous protégeons vos informations à chaque connexion.
            </h3>
          </div>
        </div>
      </div>



      <div className="auth-right slide-right">
        <div className="auth-box zoom-in">

          <h2>Sign in</h2>
         {success && (<div className="success-message"> ✔ {success} </div>
)}
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="form-animate login-form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              required
            />

            <div className="options">
              <label>
                <input type="checkbox" /> Se souvenir de moi
              </label>
              <span className="forgot">Mot de passe oublié ?</span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="switch">
            Pas de compte ? <a href="/register">S'inscrire</a>
          </p>

        </div>
      </div>

    </div>
  );
}