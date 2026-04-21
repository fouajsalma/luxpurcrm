import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

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
      alert("Inscription réussie !");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setErrors(err.response?.data?.errors || err.response?.data || { message: err.message });
    }
  };

  return (
    <div className="split-container">
      {/* Partie gauche : texte d'accueil */}
      <div className="left-panel">
        <h1 className="welcome-title-register">Create your Account</h1>
      </div>

      {/* Partie droite : formulaire */}
      <div className="right-panel">
        <div className="form-container ">
          <h2>Sign up</h2>

          {errors && (
            <div className="error">
              {Object.entries(errors).map(([field, messages]) => (
                <div key={field}>
                  <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(" ") : messages}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={submit}>
            <input
              name="nom"
              value={form.nom}
              placeholder="Nom"
              onChange={handleChange}
              required
            />
            <input
              name="prenom"
              value={form.prenom}
              placeholder="Prénom"
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              placeholder="Mot de passe"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              placeholder="Confirmation mot de passe"
              onChange={handleChange}
              required
            />
            <button type="submit">S'inscrire</button>
          </form>
        </div>
      </div>
    </div>
  );
}