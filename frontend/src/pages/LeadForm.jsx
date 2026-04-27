import { useEffect, useState } from "react";
import api from "../services/api";
import {
  UserPlus,
  Building2,
  MapPin,
  Mail,
  Phone,
  Tag,
  Flag,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function AddLead({ lead, onCancel, onSuccess, onSubmit, loading: externalLoading }) {
  const [form, setForm] = useState({
    name: "",
    city: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    status: "new",
    priority: "medium",
    category_id: "",
    source_id: "",
    assigned_to: "",
  });

  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(externalLoading || false);
  const [success, setSuccess] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const isEditing = !!lead;

  useEffect(() => {
    // Fetch categories
    api.get("/categories")
      .then(res => {
        setCategories(res.data.data || res.data);
      })
      .catch(err => console.error("Erreur chargement catégories:", err));
    
    // Fetch sources
    api.get("/sources")
      .then(res => {
        setSources(res.data.data || res.data);
      })
      .catch(err => console.error("Erreur chargement sources:", err));
    
    // Fetch users
    setLoadingUsers(true);
    api.get("/users")
      .then(res => {
        console.log("Users reçus:", res.data);
        const usersData = res.data.data || res.data;
        setUsers(usersData);
      })
      .catch(err => {
        console.error("Erreur chargement utilisateurs:", err);
        setErrors({ submit: "Erreur lors du chargement des utilisateurs" });
      })
      .finally(() => {
        setLoadingUsers(false);
      });

    if (isEditing && lead) {
      setForm({
        name: lead.name || "",
        city: lead.city || "",
        contact_name: lead.contact_name || "",
        contact_email: lead.contact_email || "",
        contact_phone: lead.contact_phone || "",
        status: lead.status || "new",
        priority: lead.priority || "medium",
        category_id: lead.category_id || lead.category?.id || "",
        source_id: lead.source_id || lead.source?.id || "",
        assigned_to: typeof lead.assigned_to === "object" ? lead.assigned_to.id : lead.assigned_to || "",
      });
    }
  }, [isEditing, lead]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("212")) {
      value = "+" + value;
    } else if (value.startsWith("0")) {
      value = value;
    }
    setForm({ ...form, contact_phone: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Nom de l'entreprise est obligatoire";
    if (form.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
      newErrors.contact_email = "Email invalide";
    }
    if (form.contact_phone) {
      const cleanPhone = form.contact_phone.replace(/\s+/g, "");
      if (!/^(?:\+212|0)([5-7]\d{8})$/.test(cleanPhone)) {
        newErrors.contact_phone = "Numéro invalide (ex: +212612345678)";
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const dataToSend = Object.fromEntries(
        Object.entries(form).filter(([key, value]) => 
          value !== "" || ["name", "priority", "status"].includes(key)
        )
      );
      
      if (typeof dataToSend.assigned_to === "object") {
        dataToSend.assigned_to = dataToSend.assigned_to?.id || "";
      }
      
      if (isEditing && lead?.id) {
        await api.put(`/leads/${lead.id}`, dataToSend);
      } else {
        await api.post("/leads", dataToSend);
      }
      
      setSuccess(true);
      
      setTimeout(() => {
        if (onSubmit) {
          onSubmit();
        } else {
          onSuccess && onSuccess();
          onCancel && onCancel();
        }
      }, 1500);
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const apiErrors = {};
        Object.keys(err.response.data.errors).forEach(key => {
          apiErrors[key] = err.response.data.errors[key][0];
        });
        setErrors(apiErrors);
      } else {
        setErrors({ submit: isEditing ? "Erreur lors de la modification du lead" : "Erreur lors de l'ajout du lead" });
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <UserPlus className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isEditing ? "Modifier le lead" : "Ajouter un lead"}
              </h2>
              <p className="text-xs text-gray-500">
                {isEditing ? "Mettre à jour les informations du prospect" : "Créer un nouveau prospect rapidement"}
              </p>
            </div>
          </div>

          <button 
            onClick={onCancel} 
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 flex items-center gap-3 animate-fadeIn">
            <CheckCircle className="text-green-500" size={20} />
            <span className="text-green-700 font-medium">
              {isEditing ? "Lead modifié avec succès ✓" : "Lead enregistré avec succès ✓"}
            </span>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-red-700">{errors.submit}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* SECTION 1 - INFORMATIONS GÉNÉRALES */}
          <div className="p-4 rounded-lg border border-gray-200">
            <h3 className="flex items-center gap-2 text-blue-700 font-bold mb-4">
              <Building2 size={20} />
              Informations générales
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Nom de l'entreprise <span className="text-red-500">*</span>
                </label>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition ${
                  errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-indigo-300"
                }`}>
                  <Building2 className="text-indigo-500 flex-shrink-0" size={18} />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ex: Entreprise LUXPUR"
                    className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Ville</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition bg-white">
                  <MapPin className="text-indigo-500 flex-shrink-0" size={18} />
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Ex: Casablanca"
                    className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 - INFORMATIONS DE CONTACT */}
          <div className="p-4 rounded-lg border border-green-100">
            <h3 className="flex items-center gap-2 text-green-700 font-bold mb-4">
              <Mail size={20} />
              Informations de contact
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Nom du contact</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition bg-white">
                  <User className="text-green-500 flex-shrink-0" size={18} />
                  <input
                    name="contact_name"
                    value={form.contact_name}
                    onChange={handleChange}
                    placeholder="Ex: Jean Dupont"
                    className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition ${
                  errors.contact_email ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-indigo-300"
                }`}>
                  <Mail className="text-red-400 flex-shrink-0" size={18} />
                  <input
                    name="contact_email"
                    type="email"
                    value={form.contact_email}
                    onChange={handleChange}
                    placeholder="contact@entreprise.com"
                    className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
                {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Téléphone</label>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition ${
                  errors.contact_phone ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-indigo-300"
                }`}>
                  <Phone className="text-purple-500 flex-shrink-0" size={18} />
                  <input
                    name="contact_phone"
                    value={form.contact_phone}
                    onChange={handlePhoneChange}
                    placeholder="+212 6 12 34 56 78"
                    className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
                {errors.contact_phone && <p className="text-red-500 text-xs mt-1">{errors.contact_phone}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 3 - DÉTAILS ET ASSIGNATION */}
          <div className="p-4 rounded-lg border border-purple-100">
            <h3 className="flex items-center gap-2 text-purple-700 font-bold mb-4">
              <Tag size={20} />
              Détails et assignation
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Priorité <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition bg-white">
                  <Flag className="text-red-500 flex-shrink-0" size={18} />
                  <select 
                    name="priority" 
                    value={form.priority} 
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Statut <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition bg-white">
                  <Tag className="text-blue-500 flex-shrink-0" size={18} />
                  <select 
                    name="status" 
                    value={form.status} 
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                  >
                    <option value="new">Nouveau</option>
                    <option value="contacted">Contacté</option>
                    <option value="negotiation">Négociation</option>
                    <option value="converted">Converti</option>
                    <option value="lost">Perdu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Catégorie</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition bg-white">
                  <Tag className="text-green-500 flex-shrink-0" size={18} />
                  <select 
                    name="category_id" 
                    value={form.category_id} 
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                  >
                    <option value="">Sélectionner</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Source</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition bg-white">
                  <Tag className="text-purple-500 flex-shrink-0" size={18} />
                  <select 
                    name="source_id" 
                    value={form.source_id} 
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                  >
                    <option value="">Sélectionner</option>
                    {sources.map(src => (
                      <option key={src.id} value={src.id}>{src.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Assigné à</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition bg-white">
                  <User className="text-orange-500 flex-shrink-0" size={18} />
                  <select 
                    name="assigned_to" 
                    value={form.assigned_to} 
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-gray-700"
                  >
                    <option value="">Sélectionner un utilisateur</option>
                    {loadingUsers ? (
                      <option disabled>Chargement des utilisateurs...</option>
                    ) : users.length === 0 ? (
                      <option disabled>Aucun utilisateur disponible</option>
                    ) : (
                      users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name || user.username || user.full_name || user.email || `Utilisateur ${user.id}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                {!loadingUsers && users.length === 0 && (
                  <p className="text-amber-600 text-xs mt-1">
                    ⚠️ Aucun utilisateur trouvé. Vérifiez la connexion à l'API.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-5 py-2 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditing ? "Modification..." : "Enregistrement..."}
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  {isEditing ? "Modifier" : "Enregistrer"}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}