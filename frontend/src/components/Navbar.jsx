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
    <header className="flex items-center justify-between px-6 py-4 bg-[#0B1220] border-b border-gray-800">
      <div>
        <p className="text-sm text-gray-400">Espace CRM</p>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-gray-300 text-sm">
          Bienvenue{userName ? `, ${userName}` : ""}
        </span>

        {/* avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
          {userName?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}