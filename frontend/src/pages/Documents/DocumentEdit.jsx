export function DocumentEdit() {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold">Edit metadata</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs mb-1 text-white/70">Title</label>
          <input
            className="glass px-3 py-2 w-full text-sm bg-transparent outline-none"
            defaultValue="V2 Dokument.docx"
          />
        </div>
        <div>
          <label className="block text-xs mb-1 text-white/70">State</label>
          <select className="glass px-3 py-2 w-full text-sm bg-transparent outline-none">
            <option>Draft</option>
            <option>In Review</option>
            <option>Final</option>
          </select>
        </div>
      </div>
      <div className="mt-auto">
        <button className="glass-btn">Änderungen speichern</button>
      </div>
    </div>
  );
}
