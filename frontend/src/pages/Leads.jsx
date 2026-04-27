import { useCallback, useEffect, useState } from "react";
import LeadDetail from "./LeadDetail";
import LeadForm from "./LeadForm";
import api from "../services/api";
import {
  deleteLead,
  getLeads,
} from "../services/leadService";
import { 
  Plus, Search, Filter, X, Eye, Edit2, Trash2, 
  ChevronLeft, ChevronRight, TrendingUp, Users, 
  Target, Calendar, Download, RefreshCw, MoreHorizontal,
  Star, StarOff, CheckCircle, Clock, AlertCircle,
  BarChart3, FolderKanban, Phone, Mail, MapPin,
  UserCheck, Flag, Tag, ArrowUpRight
} from "lucide-react";

const initialFilters = {
  status: "",
  city: "",
  priority: "",
};

const statusConfig = {
  new: { label: "Nouveau", bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200", dot: "bg-blue-500", icon: "🔵" },
  contacted: { label: "Contacté", bg: "bg-cyan-50", text: "text-cyan-700", ring: "ring-cyan-200", dot: "bg-cyan-500", icon: "📞" },
  negotiation: { label: "Négociation", bg: "bg-purple-50", text: "text-purple-700", ring: "ring-purple-200", dot: "bg-purple-500", icon: "🤝" },
  converted: { label: "Converti", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", dot: "bg-emerald-500", icon: "✅" },
  lost: { label: "Perdu", bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200", dot: "bg-rose-500", icon: "❌" }
};

const priorityConfig = {
  low: { label: "Basse", bg: "bg-slate-50", text: "text-slate-600", ring: "ring-slate-200", dot: "bg-slate-400", icon: "🟢" },
  medium: { label: "Moyenne", bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500", icon: "🟡" },
  high: { label: "Haute", bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", dot: "bg-red-500", icon: "🔴" }
};

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [viewMode, setViewMode] = useState("table");
  
  // State pour les statistiques
  const [stats, setStats] = useState({
    total: 0,
    converted: 0,
    inProgress: 0,
    highPriority: 0
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getLeads({
        status: filters.status || undefined,
        city: filters.city || undefined,
        priority: filters.priority || undefined,
        page,
      });
      
      console.log("API Response:", response.data); // Pour déboguer
      
      const leadsData = response.data.data || [];
      const metaData = response.data.meta || {};
      
      setLeads(leadsData);
      setMeta(metaData);
      
      // Calculer les statistiques à partir des données reçues
      const totalLeads = metaData.total || leadsData.length;
      const convertedLeads = leadsData.filter(l => l.status === "converted").length;
      const inProgressLeads = leadsData.filter(l => ["new", "contacted", "negotiation"].includes(l.status)).length;
      const highPriorityLeads = leadsData.filter(l => l.priority === "high").length;
      
      setStats({
        total: totalLeads,
        converted: convertedLeads,
        inProgress: inProgressLeads,
        highPriority: highPriorityLeads
      });
      
    } catch (error) {
      console.error("Erreur lors de la récupération des leads :", error);
      setLeads([]);
      setMeta({});
      setStats({
        total: 0,
        converted: 0,
        inProgress: 0,
        highPriority: 0
      });
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = leads.filter((lead) => {
    const term = searchText.trim().toLowerCase();
    if (!term) return true;
    return (
      lead.name?.toLowerCase().includes(term) ||
      lead.city?.toLowerCase().includes(term) ||
      lead.contact_name?.toLowerCase().includes(term) ||
      lead.contact_email?.toLowerCase().includes(term) ||
      lead.contact_phone?.includes(term)
    );
  });

  const openAddForm = () => {
    setEditingLead(null);
    setShowForm(true);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleView = (lead) => {
    setSelectedLead(lead);
  };

  const handleSave = async (lead) => {
    if (!lead) return;
    setSaving(true);
    try {
      if (lead.id) {
        await api.put(`/leads/${lead.id}`, lead);
      } else {
        await api.post("/leads", lead);
      }
      await fetchLeads();
      setShowForm(false);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err.response?.data);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce lead ?")) return;
    try {
      await deleteLead(id);
      await fetchLeads();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchText("");
    setPage(1);
  };

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > (meta.last_page || 1)) return;
    setPage(nextPage);
  };

  const getStatusStyle = (status) => statusConfig[status] || { bg: "bg-gray-50", text: "text-gray-600", ring: "ring-gray-200", dot: "bg-gray-400" };
  const getPriorityStyle = (priority) => priorityConfig[priority] || { bg: "bg-gray-50", text: "text-gray-600", ring: "ring-gray-200", dot: "bg-gray-400" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Header avec statistiques */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Dashboard des leads
                </h1>
                <p className="text-slate-500 mt-1">Gérez et suivez tous vos prospects en un seul endroit</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => fetchLeads()}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                  title="Actualiser"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-200">
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={openAddForm}
                  className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  Nouveau lead
                </button>
              </div>
            </div>

            {/* Cartes Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Carte Total Leads */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Total leads</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stats.total > 0 ? `${stats.total} leads au total` : 'Aucun lead pour le moment'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              {/* Carte Converti */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Converti</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.converted}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}% du total
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>
              
              {/* Carte En progression */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">En progression</p>
                    <p className="text-3xl font-bold text-amber-600 mt-1">{stats.inProgress}</p>
                    <p className="text-xs text-slate-500 mt-2">Nouveau / Contacté / Négociation</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>
              
              {/* Carte Priorité haute */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Priorité haute</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">{stats.highPriority}</p>
                    <p className="text-xs text-slate-500 mt-2">Nécessite une attention immédiate</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6">
            <div className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un lead (nom, ville, email, téléphone)..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                  />
                </div>
                
                {/* Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none cursor-pointer bg-white appearance-none"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="new">🔵 Nouveau</option>
                      <option value="contacted">📞 Contacté</option>
                      <option value="negotiation">🤝 Négociation</option>
                      <option value="converted">✅ Converti</option>
                      <option value="lost">❌ Perdu</option>
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                  
                  <div className="relative">
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                      className="pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none cursor-pointer bg-white appearance-none"
                    >
                      <option value="">Toutes priorités</option>
                      <option value="low">🟢 Basse</option>
                      <option value="medium">🟡 Moyenne</option>
                      <option value="high">🔴 Haute</option>
                    </select>
                  </div>
                  
                  <div className="relative">
                    <select
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                      className="pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none cursor-pointer bg-white appearance-none"
                    >
                      <option value="">Toutes villes</option>
                      <option value="Casablanca">📍 Casablanca</option>
                      <option value="Rabat">📍 Rabat</option>
                      <option value="Marrakech">📍 Marrakech</option>
                      <option value="Fès">📍 Fès</option>
                      <option value="Tanger">📍 Tanger</option>
                      <option value="Agadir">📍 Agadir</option>
                    </select>
                  </div>
                  
                  {(filters.status || filters.city || filters.priority || searchText) && (
                    <button
                      onClick={resetFilters}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      Réinitialiser
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des leads */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header du tableau */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <FolderKanban className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">
                  {filteredLeads.length} lead{filteredLeads.length > 1 ? 's' : ''} trouvé{filteredLeads.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Localisation</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Priorité</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative w-10 h-10">
                            <div className="w-10 h-10 border-3 border-slate-200 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-10 h-10 border-3 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                          </div>
                          <span className="text-sm text-slate-500">Chargement des leads...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <Users className="w-8 h-8 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">Aucun lead trouvé</p>
                            <p className="text-xs text-slate-500 mt-1">Modifiez vos filtres ou créez un nouveau lead</p>
                          </div>
                          <button onClick={openAddForm} className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors">
                            + Créer un lead
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const statusStyle = getStatusStyle(lead.status);
                      const priorityStyle = getPriorityStyle(lead.priority);
                      return (
                        <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors duration-150 group cursor-pointer" onClick={() => handleView(lead)}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                <span className="text-sm font-bold text-blue-700">
                                  {lead.name?.charAt(0).toUpperCase() || '?'}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{lead.name}</p>
                                <p className="text-xs text-slate-400">ID: #{lead.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-slate-600 flex items-center gap-1.5">
                                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                                {lead.contact_name || "-"}
                              </p>
                              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                <Mail className="w-3 h-3" />
                                {lead.contact_email || "-"}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-sm text-slate-600">{lead.city || "-"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusStyle.bg} ${statusStyle.text} ring-1 ${statusStyle.ring}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                              {statusConfig[lead.status]?.label || lead.status || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text} ring-1 ${priorityStyle.ring}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`}></span>
                              {priorityConfig[lead.priority]?.label || lead.priority || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleView(lead); }}
                                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                title="Voir détails"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEdit(lead); }}
                                className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200"
                                title="Modifier"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta.last_page > 1 && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="text-sm text-slate-500">
                  Page {page} sur {meta.last_page}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changePage(page - 1)}
                    disabled={page <= 1}
                    className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1 text-sm font-medium
                      ${page <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </button>
                  <button
                    onClick={() => changePage(page + 1)}
                    disabled={page >= meta.last_page}
                    className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1 text-sm font-medium
                      ${page >= meta.last_page ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <LeadForm
          lead={editingLead}
          onCancel={() => setShowForm(false)}
          onSubmit={handleSave}
          loading={saving}
        />
      )}
      {selectedLead && (
        <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
}