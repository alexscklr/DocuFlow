export function VersionComments() {
  return (
    <div className="space-y-3 h-full flex flex-col">
      <h3 className="text-lg font-semibold">Comments</h3>
      <div className="flex-1 glass p-3 overflow-auto">
        <p className="text-sm text-white/70">Noch keine Kommentare.</p>
      </div>
      <textarea
        className="glass w-full px-3 py-2 text-sm bg-transparent outline-none"
        rows={3}
        placeholder="Kommentar hinzufügen..."
      />
      <div>
        <button className="glass-btn">Senden</button>
      </div>
    </div>
  );
}
