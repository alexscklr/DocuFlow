import { useState, useRef } from 'react';

export default function DocumentsUploadDialog({
  width = '520px',
  title,
  mode = 'upload', // 'upload' or 'download'
  documents = [],
  selectedDocumentId = '',
  onDocumentSelect,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  loading = false,
}) {
  const [selectedDocId, setSelectedDocId] = useState(selectedDocumentId);
  const [file, setFile] = useState(null);
  const [changeNote, setChangeNote] = useState('');
  const fileInputRef = useRef(null);

  const isSubmitDisabled = mode === 'upload' 
    ? (!selectedDocId || !file)
    : (!selectedDocId);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (mode === 'upload') {
      onSubmit({
        documentId: selectedDocId,
        file,
        changeNote: changeNote.trim() || 'Uploaded via Project page',
      });
    } else {
      onSubmit({
        documentId: selectedDocId,
      });
    }
  };

  const handleDocumentChange = (e) => {
    const docId = e.target.value;
    setSelectedDocId(docId);
    if (onDocumentSelect) {
      onDocumentSelect(docId);
    }
  };

  return (
    <div
      style={{ maxWidth: width }}
      className="w-full border glass rounded-lg p-6"
    >
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold text-white distance-bottom-sm">
          {title}
        </h2>

        <div className="w-full distance-bottom-sm">
          <label className="block text-2xs text-white text-left">
            Select Document
          </label>
          <select
            value={selectedDocId}
            onChange={handleDocumentChange}
            className="
              glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40
            "
          >
            <option value="">Choose a document...</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title || 'Untitled Document'}
              </option>
            ))}
          </select>
        </div>

        {mode === 'upload' && (
          <>
            <div className="w-full distance-bottom-sm">
              <label className="block text-2xs text-white text-left">
                Select File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="
                  glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40
                  file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold
                  file:bg-white/10 file:text-white hover:file:bg-white/20
                "
              />
            </div>

            <div className="w-full distance-bottom-md">
              <label className="block text-2xs text-white text-left">
                Change Note (Optional)
              </label>
              <input
                value={changeNote}
                onChange={(e) => setChangeNote(e.target.value)}
                placeholder="Describe the changes..."
                className="glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              />
            </div>
          </>
        )}

        {/* Actions */}
        <div className="w-full flex justify-between gap-4 pt-2">
          <button
            onClick={onCancel}
            className="glass-btn px-4 py-1"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled || loading}
            className={`
              glass-btn px-4 py-1
              ${isSubmitDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? 'Processing...' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
