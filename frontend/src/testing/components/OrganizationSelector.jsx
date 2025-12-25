export function OrganizationSelector({ organizations, value, onChange, disabled = false }) {
  return (
    <div>
      <label className="block text-sm mb-1">Organization</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded"
        disabled={disabled}
      >
        <option value="">Organisation wählen…</option>
        {organizations?.map((org) => (
          <option key={org.id} value={org.id}>{org.name || org.id}</option>
        ))}
      </select>
    </div>
  );
}
