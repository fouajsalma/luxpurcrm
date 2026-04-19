import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      const res = await api.post("/login", form);

      localStorage.setItem("token", res.data.token);

      alert("Login success");

      navigate("/home"); // ✅ FIX
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" onChange={handleChange} />

      <button onClick={submit}>Login</button>
    </div>
  );
}