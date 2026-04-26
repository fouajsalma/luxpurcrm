import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/home" },
  { label: "Gestion des clients", path: "/home/clients" },
  { label: "Paiements", path: "/home/payments" },
  { label: "Abonnements", path: "/home/subscriptions" },
  { label: "Tickets", path: "/home/tickets" },
  { label: "Taxes", path: "/home/taxes" },
  { label: "Paramètres", path: "/home/settings" },
];

export default function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">Luxpure CRM</div>
      </div>

      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <button className="sidebar-logout" onClick={onLogout}>
        Sign Out 
      </button>
    </aside>
  );
}
