export function DocumentPreview({ documentId }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="glass inline-block px-3 py-1 text-xs mb-1">
            V2 Dokument.docx
          </div>
          <p className="text-xs text-white/70">1170 KB · XX.XX.202X</p>
        </div>
        <button className="glass-btn text-xs">★ Favorit</button>
      </div>

      <div className="flex-1 glass flex items-center justify-center">
        <span className="text-white/50 text-sm">
          Document preview for ID: {documentId}
        </span>
      </div>
    </div>
  );
}
