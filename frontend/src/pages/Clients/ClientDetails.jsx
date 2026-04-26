export default function ClientDetails({ client, onClose }) {
  if (!client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl text-white overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900">
          <div>
            <h2 className="text-2xl font-bold">
              Détails du client
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Informations complètes du client
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            ✖
          </button>
        </div>

        {/* CONTENT */}
        <div className="grid gap-5 p-8 sm:grid-cols-2">
          {[
            ["Nom", client.name],
            ["Ville", client.city],
            ["Contact", client.contact_name],
            ["Email", client.contact_email],
            ["Téléphone", client.contact_phone],
            ["Statut", client.status === "active" ? "Actif" : "Inactif"],
            ["Catégorie", client.category?.name],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-700 bg-slate-800 p-5 hover:border-blue-500 transition"
            >
              <div className="text-xs uppercase text-slate-400">
                {label}
              </div>

              <div className="mt-2 text-base font-medium text-white">
                {value || (
                  <span className="text-slate-500 italic">
                    Non renseigné
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-8 py-5 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}