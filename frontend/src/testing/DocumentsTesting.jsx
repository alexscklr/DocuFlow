import { useState, useEffect } from 'react';
import { useDocuments } from '@/shared/hooks/useDocuments';
import { useDocumentStatuses } from '@/shared/hooks/useDocumentStatuses';
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
  const { statuses, loadStatuses } = useDocumentStatuses(projectId);
  const [newTitle, setNewTitle] = useState('');
  const [newStatusId, setNewStatusId] = useState('');
  const [editingDocId, setEditingDocId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStatusId, setEditStatusId] = useState('');
  const [sharingDocId, setSharingDocId] = useState(null);

  // Load statuses when project changes
  useEffect(() => {
    if (projectId) {
      loadStatuses();
    }
  }, [projectId, loadStatuses]);

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

      <div className="space-y-2">
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
          <div className="w-48">
            <label className="block text-sm mb-1">Status (optional)</label>
            <select
              value={newStatusId}
              onChange={(e) => setNewStatusId(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Kein Status</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={async () => {
              await addDocument({ title: newTitle, status_id: newStatusId || null });
              setNewTitle('');
              setNewStatusId('');
            }}
            disabled={!projectId || !newTitle}
            className="glass-btn"
          >
            Erstellen
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {documents.map((doc) => (
          <li key={doc.id} className="border rounded p-3">
            {editingDocId === doc.id ? (
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Neuer Titel"
                    className="flex-1 border p-2 rounded"
                  />
                  <select
                    value={editStatusId}
                    onChange={(e) => setEditStatusId(e.target.value)}
                    className="w-48 border p-2 rounded"
                  >
                    <option value="">Kein Status</option>
                    {statuses.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    className="glass-btn"
                    onClick={async () => {
                      await editDocument(doc.id, { 
                        title: editTitle,
                        status_id: editStatusId || null 
                      });
                      setEditingDocId(null);
                      setEditTitle('');
                      setEditStatusId('');
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
                      setEditStatusId('');
                    }}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-xs text-[var(--text-secondary)]">ID: {doc.id}</div>
                  {doc.status_id && (() => {
                    const status = statuses.find(s => s.id === doc.status_id);
                    return status ? (
                      <div className="flex items-center gap-2 mt-1">
                        {status.icon_url && <img src={status.icon_url} alt={status.name} className="w-4 h-4" />}
                        <span
                          className="inline-block w-3 h-3 rounded"
                          style={{ backgroundColor: status.color || '#cccccc' }}
                        />
                        <span className="text-xs">{status.name}</span>
                      </div>
                    ) : null;
                  })()}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="glass-btn"
                    onClick={() => {
                      setEditingDocId(doc.id);
                      setEditTitle(doc.title);
                      setEditStatusId(doc.status_id || '');
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
