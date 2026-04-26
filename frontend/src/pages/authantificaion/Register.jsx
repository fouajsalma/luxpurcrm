import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors(null);

    if (form.password !== form.password_confirmation) {
      setErrors({ password: ["Les mots de passe ne correspondent pas"] });
      return;
    }

    try {
      const res = await api.post("/register", form);
      localStorage.setItem("token", res.data.token);
      setSuccess("Inscription réussie !");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setErrors(err.response?.data?.errors || err.response?.data || { message: err.message });
    }
  };

  return (
    <div className="auth-container fade-in">

      <div className="auth-left slide-left">
        <h1>Create your Account</h1>
        <p>Gérez vos clients, suivez vos équipes et développez votre business.</p>
        {/* CARDS SECTION */}
        <div className="info-cards">

          <div className="info-card">
            <img src="/icons/analytics.png" />
            <h3><span>Analytics</span><br />
              Track your performance easily</h3>
          </div>

          <div className="info-card">
            <img src="/icons/security.png" />
            <h3><span>Security</span><br />
              Your data is fully protected</h3>
          </div>

          <div className="info-card">
            <img src="/icons/automation.png" />
            <h3><span>Automation</span><br />
              Save time with smart tools</h3>
          </div>

        </div>
      </div>

      <div className="auth-right slide-right">
        <div className="auth-box zoom-in">

          <h2>Sign up</h2>
          {success && (
            <div className="success-message">
              ✔ {success}
            </div>
          )}
          {errors && (
            <div className="error">
              {Object.entries(errors).map(([field, messages]) => (
                <div key={field}>
                  <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(" ") : messages}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={submit} className="form-animate register-form">
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={form.prenom}
              onChange={handleChange}
              required
            />
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
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirmation mot de passe"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />

            <button type="submit">S'inscrire</button>
          </form>

          <p className="switch">
            Déjà un compte ? <a href="/login">Se connecter</a>
          </p>

        </div>
      </div>

    </div>
  );
}