import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    last_name:"",
    email: "",
    password: "",
    password_confirmation: "",

  });
  const [errors, setErrors] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e?.preventDefault();
    setErrors(null);

      if (form.password !== form.password_confirmation) {
    setErrors({ password: ["Passwords do not match"] });
    return;
  }

    try {
      const res = await api.post("/register", form);

      localStorage.setItem("token", res.data.token);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setErrors(err.response?.data?.errors || err.response?.data || { message: err.message });
    }
  };

  return (
    <div>
      <h2>Register</h2>

      {errors && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          {Array.isArray(errors)
            ? errors.map((error, index) => <div key={index}>{error}</div>)
            : typeof errors === "object"
            ? Object.entries(errors).map(([field, messages]) => (
                <div key={field}>
                  <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(" ") : messages}
                </div>
              ))
            : errors.message || JSON.stringify(errors)}
        </div>
      )}

      <form onSubmit={submit}>
        <input
          name="name"
          value={form.name}
          placeholder="Name"
          onChange={handleChange}
        />
        <input
          name="email"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password_confirmation"
          value={form.password_confirmation}
          placeholder="Confirm Password"
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
