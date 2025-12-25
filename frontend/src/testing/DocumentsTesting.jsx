import { useState } from 'react';
import { useDocuments } from '@/shared/hooks/useDocuments';
import { useAppData } from '@/shared/context/AppDataContextBase';
import { useAuthSession } from '@/shared/hooks/useAuthSession';
import { useProjects } from '@/shared/hooks/useProjects';
import { ProjectSelector } from './components';
import DocumentShares from './DocumentShares';

export default function DocumentsTesting({ projectId, setProjectId }) {
  const { organizations } = useAppData();
  const { user } = useAuthSession();
  const { projects: allProjects } = useProjects(null, { organizations, userId: user?.id });
  const { documents, loading, error, loadDocuments, addDocument, editDocument, removeDocument } = useDocuments(projectId);
  const [newTitle, setNewTitle] = useState('');
  const [editingDocId, setEditingDocId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [sharingDocId, setSharingDocId] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <ProjectSelector
          projects={allProjects}
          value={projectId}
          onChange={setProjectId}
        />
        <button type="button" onClick={loadDocuments} disabled={!projectId || loading} className="glass-btn">
          {loading ? 'Lädt…' : 'Laden'}
        </button>
      </div>
      {error && (
        <div className="text-red-500 text-sm space-y-1">
          <div>Fehler unter dem Projektauswahl-Selector (DocumentsTesting): {error.message || String(error)}</div>
          {error.details && <div>Details: {error.details}</div>}
          {error.hint && <div>Hint: {error.hint}</div>}
          {typeof error.status !== 'undefined' && <div>Status: {error.status}</div>}
          <pre className="whitespace-pre-wrap break-words bg-red-50 border border-red-200 text-xs p-2 rounded">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm mb-1">Neues Dokument</label>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Titel"
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="button"
          onClick={async () => {
            await addDocument({ title: newTitle });
            setNewTitle('');
          }}
          disabled={!projectId || !newTitle}
          className="glass-btn"
        >
          Erstellen
        </button>
      </div>

      <ul className="space-y-2">
        {documents.map((doc) => (
          <li key={doc.id} className="border rounded p-3">
            {editingDocId === doc.id ? (
              <div className="flex items-center justify-between">
                <div className="flex-1 flex gap-2 items-center">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Neuer Titel"
                    className="flex-1 border p-2 rounded"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="glass-btn"
                    onClick={async () => {
                      await editDocument(doc.id, { title: editTitle });
                      setEditingDocId(null);
                      setEditTitle('');
                    }}
                    disabled={!editTitle}
                  >
                    Speichern
                  </button>
                  <button
                    type="button"
                    className="glass-btn"
                    onClick={() => {
                      setEditingDocId(null);
                      setEditTitle('');
                    }}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-xs text-[var(--text-secondary)]">ID: {doc.id}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="glass-btn"
                    onClick={() => {
                      setEditingDocId(doc.id);
                      setEditTitle(doc.title);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="glass-btn"
                    onClick={() => removeDocument(doc.id)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="glass-btn"
                    onClick={() => setSharingDocId(prev => (prev === doc.id ? null : doc.id))}
                  >
                    {sharingDocId === doc.id ? 'Teilen schließen' : 'Teilen'}
                  </button>
                </div>
              </div>
            )}
            {sharingDocId === doc.id && (
              <div className="mt-3">
                <DocumentShares documentId={doc.id} projectId={projectId} />
              </div>
            )}
          </li>
        ))}
        {documents.length === 0 && (
          <li className="text-sm text-[var(--text-secondary)]">Keine Dokumente geladen.</li>
        )}
      </ul>
    </div>
  );
}
