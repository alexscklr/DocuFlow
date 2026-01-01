import { useState } from 'react';

export default function DokumentFormDialog({
  width = '520px',
  title = 'Create Document',
  submitLabel = 'Create',
  initialValues = { title: '', state: '', version: '' },
  onCancel,
  onSubmit,
}) {
  const [docTitle, setDocTitle] = useState(initialValues.title);
  const [state, setState] = useState(initialValues.state);
  const [version, setVersion] = useState(initialValues.version);

  const isSubmitDisabled = !docTitle.trim();

  const handleSubmit = () => {
    const date = new Date().toLocaleString();
    onSubmit({ title: docTitle, state, version, date });
  };

  return (
    <div style={{ maxWidth: width }} className="w-full border glass rounded-lg p-6">
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold text-white distance-bottom-sm">{title}</h2>

        <div className="w-full distance-bottom-sm">
          <label className="block text-2xs text-white text-left">Title</label>
          <input
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className="glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          />
        </div>

        <div className="w-full distance-bottom-sm">
          <label className="block text-2xs text-white text-left">State</label>
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="e.g. draft, published"
            className="glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          />
        </div>

        <div className="w-full distance-bottom-md">
          <label className="block text-2xs text-white text-left">Version</label>
          <input
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g. 1.0"
            className="glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          />
        </div>

        <div className="w-full flex justify-between gap-4 pt-2">
          <button onClick={onCancel} className="glass-btn px-4 py-1">Cancel</button>

          <button
            type="button"
            onClick={handleSubmit}
            className={`glass-btn px-4 py-1 ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
