import { useState, useEffect } from 'react';
import { useDocumentStatuses } from '@/shared/hooks/useDocumentStatuses';
import { useProjects } from '@/shared/hooks/useProjects';
import { useAppData } from '@/shared/context/AppDataContextBase';
import { useAuthSession } from '@/shared/hooks/useAuthSession';
import { ProjectSelector } from './components';

export default function DocumentStatusManager({ projectId: externalProjectId }) {
  const [projectId, setProjectId] = useState(externalProjectId || '');
  const { organizations } = useAppData();
  const { user } = useAuthSession();
  const { projects } = useProjects(null, { organizations, userId: user?.id });
  const { statuses, loading, error, loadStatuses, addStatus, updateStatus, deleteStatus } = useDocumentStatuses(projectId);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#3b82f6', icon_url: '' });

  useEffect(() => {
    if (projectId) {
      loadStatuses();
    }
  }, [projectId, loadStatuses]);

  // Sync with external projectId if provided
  useEffect(() => {
    if (externalProjectId !== undefined && externalProjectId !== projectId) {
      setProjectId(externalProjectId);
    }
  }, [externalProjectId]);

  const handleSubmitNew = async () => {
    if (!formData.name.trim() || !projectId) return;
    
    const { error } = await addStatus({
      name: formData.name.trim(),
      color: formData.color || null,
      icon_url: formData.icon_url.trim() || null,
    });
    
    if (!error) {
      setIsAdding(false);
      setFormData({ name: '', color: '#3b82f6', icon_url: '' });
    } else {
      alert('Fehler beim Erstellen: ' + (error.message || String(error)));
    }
  };

  const handleSubmitEdit = async () => {
    if (!formData.name.trim() || !editingId) return;
    
    const { error } = await updateStatus(editingId, {
      name: formData.name.trim(),
      color: formData.color || null,
      icon_url: formData.icon_url.trim() || null,
    });
    
    if (!error) {
      setEditingId(null);
      setFormData({ name: '', color: '#3b82f6', icon_url: '' });
    } else {
      alert('Fehler beim Aktualisieren: ' + (error.message || String(error)));
    }
  };

  const handleDelete = async (statusId) => {
    if (!confirm('Status wirklich löschen? Dokumente mit diesem Status werden nicht gelöscht.')) return;
    
    const { error } = await deleteStatus(statusId);
    if (error) {
      alert('Fehler beim Löschen: ' + (error.message || String(error)));
    }
  };

  const startEdit = (status) => {
    setEditingId(status.id);
    setFormData({
      name: status.name,
      color: status.color || '#3b82f6',
      icon_url: status.icon_url || '',
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', color: '#3b82f6', icon_url: '' });
  };

  return (
    <div className="space-y-4">
      <div className="border rounded p-4 bg-[var(--bg-secondary)]">
        <h3 className="font-medium mb-3">Dokumentstatus-Verwaltung (Projekt-Level)</h3>

        {/* Project Selector */}
        <div className="mb-4">
          <ProjectSelector
            projects={projects}
            value={projectId}
            onChange={setProjectId}
          />
        </div>

        {!projectId ? (
          <p className="text-sm text-[var(--text-secondary)]">Bitte ein Projekt auswählen</p>
        ) : (
          <>
            {error && (
              <div className="text-red-500 text-sm mb-3">
                {error.message || String(error)}
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">Status für dieses Projekt</h4>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(true);
                  setEditingId(null);
                  setFormData({ name: '', color: '#3b82f6', icon_url: '' });
                }}
                disabled={isAdding}
                className="glass-btn text-sm"
              >
                + Neuer Status
              </button>
            </div>

            {/* Form für neuen Status oder Bearbeitung */}
            {(isAdding || editingId) && (
              <div className="border rounded p-3 mb-3 bg-white dark:bg-gray-800">
                <h4 className="font-medium text-sm mb-2">
                  {isAdding ? 'Neuen Status erstellen' : 'Status bearbeiten'}
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs mb-1">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="z.B. In Bearbeitung, Fertig, Entwurf"
                      className="w-full border p-2 rounded text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs mb-1">Farbe</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-12 h-8 border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          placeholder="#3b82f6"
                          className="flex-1 border p-2 rounded text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Icon URL (optional)</label>
                      <input
                        type="text"
                        value={formData.icon_url}
                        onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                        placeholder="https://..."
                        className="w-full border p-2 rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="glass-btn text-sm"
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      onClick={isAdding ? handleSubmitNew : handleSubmitEdit}
                      disabled={!formData.name.trim()}
                      className="glass-btn text-sm bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isAdding ? 'Erstellen' : 'Speichern'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste der Statuses */}
            {loading ? (
              <div className="text-sm text-[var(--text-secondary)]">Lädt...</div>
            ) : statuses.length > 0 ? (
              <ul className="space-y-2">
                {statuses.map((status) => (
                  <li
                    key={status.id}
                    className={`border rounded p-3 ${
                      editingId === status.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {status.icon_url && (
                          <img src={status.icon_url} alt={status.name} className="w-6 h-6" />
                        )}
                        <span
                          className="inline-block w-6 h-6 rounded flex-shrink-0"
                          style={{ backgroundColor: status.color || '#cccccc' }}
                        />
                        <div>
                          <div className="font-medium">{status.name}</div>
                          <div className="text-xs text-[var(--text-secondary)]">
                            {status.project_id === null ? 'Template' : 'Projekt'} {status.color ? '• ' + status.color : ''} {status.icon_url ? '• Icon vorhanden' : ''}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {status.project_id !== null && (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(status)}
                              className="glass-btn text-sm"
                            >
                              Bearbeiten
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(status.id)}
                              className="glass-btn text-sm bg-red-600 hover:bg-red-700 text-white"
                            >
                              Löschen
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-[var(--text-secondary)]">
                Noch keine Statuses für dieses Projekt erstellt
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
