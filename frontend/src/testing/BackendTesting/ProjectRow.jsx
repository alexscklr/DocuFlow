import { useState } from 'react';

export function ProjectRow({ project, onUpdate, onDelete, globalLoading }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: project.name, description: project.description || '' });
  const [deleting, setDeleting] = useState(false);

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const { error } = await onUpdate(project.id, { name: form.name, description: form.description });
    setSaving(false);
    if (!error) setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Projekt wirklich löschen?')) return;
    setDeleting(true);
    const { error } = await onDelete(project.id);
    setDeleting(false);
    if (error) console.error('Delete failed:', error);
  };

  if (editing) {
    return (
      <li className="p-3 rounded border border-[var(--border)] bg-[var(--bg-tertiary)] shadow-sm flex flex-col gap-3">
        <form onSubmit={submitEdit} className="flex flex-col gap-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            required
            className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
            placeholder="Name"
          />
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
            placeholder="Beschreibung"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="glass glass-btn"
            >{saving ? 'Speichern…' : 'Speichern'}</button>
            <button
              type="button"
              onClick={() => { setEditing(false); setForm({ name: project.name, description: project.description || '' }); }}
              className="glass glass-btn"
            >Abbrechen</button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between p-3 rounded border border-[var(--border)] bg-[var(--bg-tertiary)] shadow-sm">
      <span>
        <span className="font-medium">{project.name}</span>
        <span className="ml-2 text-sm text-[var(--text-secondary)]">{project.description}</span>
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          disabled={globalLoading}
          className="glass glass-btn"
        >Edit</button>
        <DeleteProjectButton
          onDelete={handleDelete}
          disabled={globalLoading || deleting}
        />
      </div>
    </li>
  );
}

function DeleteProjectButton({ onDelete, disabled }) {
  const [localLoading, setLocalLoading] = useState(false);
  const handle = async () => {
    setLocalLoading(true);
    await onDelete();
    setLocalLoading(false);
  };
  return (
    <button
      type="button"
      onClick={handle}
      disabled={disabled || localLoading}
      className="glass glass-btn"
    >
      {localLoading ? 'Deleting…' : 'Delete'}
    </button>
  );
}
