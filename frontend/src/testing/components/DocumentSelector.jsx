export function DocumentSelector({ documents, knownIds, value, onChange, showInput = false, inputValue = '', onInputChange }) {
  return (
    <div className="flex gap-2 items-end">
      {showInput && (
        <div className="flex-1">
          <label className="block text-sm mb-1">Document ID</label>
          <input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="doc-uuid"
            className="w-full border p-2 rounded"
          />
        </div>
      )}
      <div className="flex-1">
        <label className="block text-sm mb-1">Document</label>
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Dokument wählen…</option>
          {documents.map((d) => (
            <option key={d.id} value={d.id}>{d.title || d.id}</option>
          ))}
          {knownIds.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
