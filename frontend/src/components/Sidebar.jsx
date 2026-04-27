import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  CreditCard,
  Layers,
  Ticket,
  Percent,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: Home },
  { label: "Leads", path: "/leads", icon: Users },
  { label: "Clients", path: "/clients", icon: Users },
  { label: "Paiements", path: "/payments", icon: CreditCard },
  { label: "Abonnements", path: "/subscriptions", icon: Layers },
  { label: "Tickets", path: "/tickets", icon: Ticket },
  { label: "Taxes", path: "/taxes", icon: Percent },
];

export default function Sidebar({ onLogout }) {
  return (
    <aside className="w-64 h-screen bg-[#0B1220] border-r border-gray-800 flex flex-col justify-between shadow-xl">
      
      {/* Logo */}
      <div>
        <div className="px-6 py-5 text-white font-bold text-xl tracking-wide border-b border-gray-800">
            LUXPURE
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
            <NavLink
  key={item.path}
  to={item.path}
  className={({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
    ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
        : "text-gray-100 hover:bg-gray-800 hover:text-white"
    }`
  }
>
  <Icon
    size={18}
    className="text-gray-200 group-hover:text-white transition"
  />
  <span className="tracking-wide">{item.label}</span>
</NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}