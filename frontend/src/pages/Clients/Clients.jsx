import { useCallback, useEffect, useState } from "react";
import ClientFilters from "./ClientFilters";
import ClientForm from "./ClientForm";
import ClientDetails from "./ClientDetails";
import {
  createClient,
  deleteClient,
  getClients,
  getCategories,
  updateClient,
} from "../../services/clientService";

const initialFilters = {
  status: "",
  city: "",
  category_id: "",
};

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});



 const fetchClients = useCallback(async () => {
  setLoading(true);
  try {
    const response = await getClients({
      status: filters.status || undefined,
      city: filters.city || undefined,
      category_id: filters.category_id || undefined,
      page,
    });

    // 🔥 FIX IMPORTANT ICI
    setClients(response.data); // au lieu de response.data.data
    setMeta(response.data.meta || {});
  } catch (error) {
    console.error("Erreur :", error);
    setClients([]);
  } finally {
    setLoading(false);
  }
}, [filters, page]);


  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data?.data || response.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };

    fetchCategories();
  }, []);

  const filteredClients = clients.filter((client) => {
    const term = searchText.trim().toLowerCase();
    if (!term) return true;

    return (
      client.name?.toLowerCase().includes(term) ||
      client.city?.toLowerCase().includes(term) ||
      client.contact_name?.toLowerCase().includes(term) ||
      client.contact_email?.toLowerCase().includes(term) ||
      client.contact_phone?.includes(term) ||
      client.category?.name?.toLowerCase().includes(term)
    );
  });

  const openAddForm = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleView = (client) => {
    setSelectedClient(client);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (payload.id) {
        await updateClient(payload.id, payload);
      } else {
        await createClient(payload);
      }
      setShowForm(false);
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du client :", error);
      alert("Impossible de sauvegarder le client.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce client ?")) return;

    try {
      await deleteClient(id);
      fetchClients();
    } catch (error) {
      console.error("Erreur lors de la suppression du client :", error);
      alert("Impossible de supprimer le client.");
    }
  };

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > (meta.last_page || 1)) return;
    setPage(nextPage);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des clients</h1>
          <button
            onClick={openAddForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Ajouter un client
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ClientFilters
            filters={filters}
            categories={categories}
            onChange={(newFilters) => {
              setFilters(newFilters);
              setPage(1);
            }}
          />
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Table */}
        <table className="w-full border">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Ville</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  Chargement des clients...
                </td>
              </tr>
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.city || "-"}</td>
                  <td>{client.contact_name || "-"}</td>
                  <td>{client.contact_email || "-"}</td>
                  <td>{client.contact_phone || "-"}</td>
                  <td>{client.category?.name || "-"}</td>
                  <td>{client.status || "-"}</td>
                  <td>
                    <button onClick={() => handleView(client)}>👁</button>
                    <button onClick={() => handleEdit(client)}>✏</button>
                    <button onClick={() => handleDelete(client.id)}>🗑</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  Aucun client trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex gap-2">
          <button onClick={() => changePage(page - 1)}>Prev</button>
          <span>{page}</span>
          <button onClick={() => changePage(page + 1)}>Next</button>
        </div>

        {/* Form */}
        {showForm && (
          <ClientForm
            client={editingClient}
            categories={categories}
            onCancel={() => setShowForm(false)}
            onSubmit={handleSave}
            loading={saving}
          />
        )}

        {/* Detail */}
        {selectedClient && (
          <ClientDetails
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
          />
        )}
      </div>
    </div>
  );
}