import { useLocation } from "react-router-dom";

const titleMap = {
  "/home": "Tableau de bord",
  "/home/clients": "Clients",
  "/home/payments": "Paiements",
  "/home/subscriptions": "Abonnements",
  "/home/tickets": "Tickets",
  "/home/taxes": "Taxes",
  "/home/settings": "Paramètres",
};

export default function Navbar({ userName }) {
  const location = useLocation();
  const title = titleMap[location.pathname] || "Luxpure CRM";

  return (
    <header className="dashboard-navbar">
      <div>
        <p className="navbar-subtitle">Espace CRM,</p>
        <h1 className="navbar-title">{title}</h1>
      </div>
      <div className="navbar-meta">
        <span>Bienvenue{userName ? `, ${userName}` : ""}</span>
      </div>
    </header>
  );
}
