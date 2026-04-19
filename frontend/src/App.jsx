import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

function Home() {
  return <h1>🏠 Home Page</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <h1>CRM Auth Bonjour salma</h1>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}