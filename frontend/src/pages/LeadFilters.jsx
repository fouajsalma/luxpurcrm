export default function LeadFilters({ filters, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">Ville</label>
        <input
          placeholder="Toutes les villes"
          value={filters.city || ""}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">Statut</label>
        <select
          value={filters.status || ""}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Tous les statuts</option>
          <option value="new">Nouveau</option>
          <option value="contacted">Contacté</option>
          <option value="negotiation">En négociation</option>
          <option value="converted">Converti</option>
          <option value="lost">Perdu</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.18em] text-slate-400">Priorité</label>
        <select
          value={filters.priority || ""}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Toutes les priorités</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
}
