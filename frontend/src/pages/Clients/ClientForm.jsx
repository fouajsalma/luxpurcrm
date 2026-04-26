import { useState } from "react";
import Clients from "./Clients";

const emptyClient = {
  name: "",
  city: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  status: "active",
  category_id: "",
};

export default function ClientForm({ client = null, categories = [], onCancel, onSubmit, loading }) {
  const [form, setForm] = useState({ ...emptyClient, ...client });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const validation = {};

    if (!form.name.trim()) validation.name = "Le nom du client est requis";

    if (!form.status) validation.status = "Le statut est requis";

    if (form.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
      validation.contact_email = "Email invalide";
    }

    setErrors(validation);
    return Object.keys(validation).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(form);
      setSuccess("Client enregistré avec succès !");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <div className="absolute inset-0" onClick={onCancel} />

      <div className="relative bg-slate-900 rounded-3xl border border-slate-700 shadow-xl w-full max-w-4xl overflow-hidden text-white">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-10 py-6 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900">
          <div>
            <h2 className="text-xl font-bold">
              {client ? "Modifier le client" : "Ajouter un client"}
            </h2>
            <p className="text-sm text-slate-400">
              {client ? "Modifier les informations" : "Remplir les informations du client"}
            </p>
          </div>

          <button onClick={onCancel} className="text-slate-400 hover:text-white">
            ✖
          </button>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="m-6 p-3 bg-green-600/20 border border-green-500 rounded-xl text-green-400">
            {success}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NOM */}
            <div>
              <label className="block text-sm mb-1">Nom client *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* VILLE */}
            <div>
              <label className="block text-sm mb-1">Ville</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              />
            </div>

            {/* CONTACT */}
            <div>
              <label className="block text-sm mb-1">Nom du contact</label>
              <input
                name="contact_name"
                value={form.contact_name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                name="contact_email"
                value={form.contact_email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              />
              {errors.contact_email && <p className="text-red-400 text-xs mt-1">{errors.contact_email}</p>}
            </div>

            {/* TELEPHONE */}
            <div>
              <label className="block text-sm mb-1">Téléphone</label>
              <input
                name="contact_phone"
                value={form.contact_phone}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm mb-1">Catégorie</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              >
                <option value="">Sélectionner</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm mb-1">Statut *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
              >
                <option value="active">🟢 Actif</option>
                <option value="inactive">🔴 Inactif</option>
              </select>
              {errors.status && <p className="text-red-400 text-xs mt-1">{errors.status}</p>}
            </div>

          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-4 p-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
             {loading ? "Enregistrement..." : client ? "Enregistrer" : "Modifier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}