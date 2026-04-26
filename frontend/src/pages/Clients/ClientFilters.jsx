export default function ClientFilters({ filters, onChange, categories = [] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      
      {/* VILLE */}
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">
          Ville
        </label>
        <input
          placeholder="Toutes les villes"
          value={filters.city || ""}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* STATUS */}
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">
          Statut
        </label>
        <select
          value={filters.status || ""}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Tous les statuts</option>
          <option value="active">🟢 Actif</option>
          <option value="inactive">🔴 Inactif</option>
        </select>
      </div>

      {/* CATEGORY */}
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">
          Catégorie
        </label>
        <select
          value={filters.category_id || ""}
          onChange={(e) => onChange({ ...filters, category_id: e.target.value })}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}