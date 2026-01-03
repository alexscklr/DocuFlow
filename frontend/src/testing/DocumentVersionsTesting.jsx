import { useEffect, useState, useRef, useCallback } from 'react';
import { useDocumentVersions } from '@/shared/hooks/useDocumentVersions';
import { useDocuments } from '@/shared/hooks/useDocuments';
import { useProjects } from '@/shared/hooks/useProjects';
import { useDocumentStatuses } from '@/shared/hooks/useDocumentStatuses';
import { useAppData } from '@/shared/context/AppDataContextBase';
import { useAuthSession } from '@/shared/hooks/useAuthSession';
import { OrganizationSelector, ProjectSelector, DocumentSelector } from './components';
import DocumentShares from './DocumentShares';

export default function DocumentVersionsTesting({ 
  organizationId, 
  setOrganizationId, 
  projectId, 
  setProjectId, 
  documentId, 
  setDocumentId 
}) {
  const [knownDocumentIds, setKnownDocumentIds] = useState([]);
  const { organizations } = useAppData();
  const { user } = useAuthSession();

  const { versions, loading, error, loadVersions, uploadAndCreateVersion, loadComments, addComment, downloadFile, removeOldVersions, revertToVersion } = useDocumentVersions(documentId);
    const { documents, loadDocuments, editDocument } = useDocuments(projectId);
  const { statuses, loadStatuses } = useDocumentStatuses(projectId);
  
  // Use useProjects with organizationId if set, otherwise load all user projects
  const { projects, loadProjects: loadProjectsForOrg } = useProjects(
    organizationId || null, 
    !organizationId ? { organizations, userId: user?.id } : undefined
  );
  const loadedOrgRef = useRef(null);

  const [fileToUpload, setFileToUpload] = useState(null);
  const [changeNote, setChangeNote] = useState('');
  const [commentText, setCommentText] = useState('');
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [comments, setComments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [downloadingVersionId, setDownloadingVersionId] = useState(null);
  const [showSharePanel, setShowSharePanel] = useState(false);

  const handleLoadComments = async (versionId) => {
    setSelectedVersion(versionId);
    const { data } = await loadComments(versionId);
    setComments(data || []);
  };

  useEffect(() => {
    if (projectId) {
      loadStatuses();
    }
  }, [projectId, loadStatuses]);
  useEffect(() => {
    if (organizationId && loadedOrgRef.current !== organizationId) {
      loadProjectsForOrg();
      loadedOrgRef.current = organizationId;
    } else if (!organizationId && loadedOrgRef.current !== null) {
      // Organization was deselected, projects will auto-load via useProjects hook
      loadedOrgRef.current = null;
    }
  }, [organizationId, loadProjectsForOrg]);

  // Load statuses when project changes
  useEffect(() => {
    if (projectId) {
      loadStatuses();
    }
  }, [projectId, loadStatuses]);

  const rememberDocId = useCallback((id) => {
    if (!id) return;
    setKnownDocumentIds((prev) => {
      if (prev.includes(id)) return prev;
      return [id, ...prev].slice(0, 10);
    });
  }, [setKnownDocumentIds]);

  const handleUploadAndCreateVersion = useCallback(async () => {
    if (!documentId || !projectId || !organizationId || !fileToUpload) return;
    
    try {
      setUploading(true);
      const noteToUse = changeNote.trim() || 'Initial upload';
      const { error, data } = await uploadAndCreateVersion({
        organizationId,
        projectId,
        documentId,
        file: fileToUpload,
        changeNote: noteToUse,
      });
      if (error) throw error;
      alert(`Version ${data?.version_number ?? ''} erstellt`);
      rememberDocId(documentId);
      setFileToUpload(null);
      // Don't clear changeNote - keep it for next upload
    } catch (err) {
      alert(err.message || String(err));
    } finally {
      setUploading(false);
    }
  }, [documentId, projectId, organizationId, fileToUpload, changeNote, uploadAndCreateVersion, rememberDocId]);

  const handleDownloadVersion = useCallback(async (version) => {
    if (!version.file_url) return;
    
    try {
      setDownloadingVersionId(version.id);
      const { blob, error } = await downloadFile(version.file_url);
      if (error) throw error;
      
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const name = String(version.file_url).split('/').pop() || 'download';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      alert(err.message || String(err));
    } finally {
      setDownloadingVersionId(null);
    }
  }, [downloadFile]);

    // Get current document
    const currentDocument = documents.find(d => d.id === documentId);

    // Get current status info
    const currentStatus = currentDocument?.status_id 
      ? statuses.find(s => s.id === currentDocument.status_id)
      : null;

    const handleStatusChange = useCallback(async (statusId) => {
      if (!documentId) return;
      const { error } = await editDocument(documentId, { status_id: statusId });
      if (error) {
        alert('Fehler beim Ändern des Status: ' + (error.message || String(error)));
      } else {
        alert('Status aktualisiert');
      }
    }, [documentId, editDocument]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 items-end">
        <OrganizationSelector
          organizations={organizations}
          value={organizationId}
          onChange={setOrganizationId}
        />
        <ProjectSelector
          projects={projects}
          value={projectId}
          onChange={setProjectId}
          disabled={false}
        />
        <button type="button" onClick={loadDocuments} disabled={!projectId} className="glass-btn">Dokumente laden</button>
      </div>

      <DocumentSelector
        documents={documents}
        knownIds={knownDocumentIds}
        value={documentId}
        onChange={setDocumentId}
        showInput={false}
        inputValue={documentId}
        onInputChange={setDocumentId}
      />

      {documentId && currentDocument && (
        <div className="border rounded p-3 bg-[var(--bg-secondary)]">
          <h3 className="font-medium mb-2">Dokumentstatus</h3>
          {statuses.length > 0 ? (
            <div className="space-y-3">
              {/* Aktueller Status */}
              <div>
                <span className="text-[var(--text-secondary)] text-sm">Aktueller Status:</span>
                <div className="mt-1 flex items-center gap-2">
                  {currentStatus ? (
                    <>
                      {currentStatus.icon_url && <img src={currentStatus.icon_url} alt={currentStatus.name} className="w-5 h-5" />}
                      <span
                        className="inline-block w-5 h-5 rounded"
                        style={{ backgroundColor: currentStatus.color || '#cccccc' }}
                      />
                      <span className="font-medium">{currentStatus.name}</span>
                    </>
                  ) : (
                    <span className="text-[var(--text-secondary)] text-sm">Kein Status zugeordnet</span>
                  )}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <span className="text-[var(--text-secondary)] text-sm">Status wechseln:</span>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {statuses.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleStatusChange(s.id)}
                      className={`flex items-center gap-2 p-2 rounded border transition-colors ${
                        currentStatus?.id === s.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {s.icon_url && <img src={s.icon_url} alt={s.name} className="w-4 h-4" />}
                      <span
                        className="inline-block w-3 h-3 rounded flex-shrink-0"
                        style={{ backgroundColor: s.color || '#cccccc' }}
                      />
                      <span className="text-sm">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Status Button */}
              {currentStatus && (
                <button
                  type="button"
                  onClick={() => handleStatusChange(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Status entfernen
                </button>
              )}
            </div>
          ) : (
            <div className="text-sm text-[var(--text-secondary)]">Keine Statusse für dieses Projekt erstellt</div>
          )}
        </div>
      )}
      <div className="flex gap-2">
        <button type="button" onClick={loadVersions} disabled={!documentId || loading} className="glass-btn">
          {loading ? 'Lädt…' : 'Laden'}
        </button>
        <button
          type="button"
          className="glass-btn"
          disabled={!documentId}
          onClick={() => setShowSharePanel((prev) => !prev)}
        >
          {showSharePanel ? 'Teilen schließen' : 'Teilen'}
        </button>
      </div>

      {error && <div className="text-red-500 text-sm">{error.message || String(error)}</div>}

      {showSharePanel && documentId && (
        <div className="mt-2">
          <DocumentShares documentId={documentId} projectId={projectId} />
        </div>
      )}

      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm mb-1">Change Note</label>
          <input
            value={changeNote}
            onChange={(e) => setChangeNote(e.target.value)}
            placeholder="Beschreibung der Änderung"
            className="w-full border p-2 rounded"
          />
        </div>
        <label className="glass-btn cursor-pointer">
          Datei wählen
          <input type="file" className="hidden" onChange={(e) => setFileToUpload(e.target.files?.[0] || null)} />
        </label>
        {fileToUpload && (
          <span className="text-sm text-[var(--text-secondary)]">{fileToUpload.name}</span>
        )}
        <button
          type="button"
          className="glass-btn"
          disabled={uploading || !documentId || !projectId || !organizationId || !fileToUpload}
          onClick={handleUploadAndCreateVersion}
        >
          {uploading ? 'Lädt…' : 'Datei hochladen & Version'}
        </button>
      </div>

      <div className="space-y-2">
        {versions.map((v) => (
          <div key={v.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Version {v.version_number}</div>
                {v.change_note && (
                  <div className="text-sm text-[var(--text-secondary)] mt-1">{v.change_note}</div>
                )}
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  {new Date(v.created_at).toLocaleString('de-DE')}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {v.file_url && (
                  <button
                    type="button"
                    className="glass-btn"
                    disabled={downloadingVersionId === v.id}
                    onClick={() => handleDownloadVersion(v)}
                  >
                    {downloadingVersionId === v.id ? 'Lädt…' : 'Download'}
                  </button>
                )}
                <button type="button" className="glass-btn" onClick={() => handleLoadComments(v.id)}>
                  Kommentare laden
                </button>
                <button 
                  type="button" 
                  className="glass-btn bg-orange-600 hover:bg-orange-700"
                  onClick={async () => {
                    if (!confirm(`Alle Versionen NACH Version ${v.version_number} löschen und auf diese Version zurücksetzen?`)) return;
                    const { error } = await revertToVersion(v.id);
                    if (error) {
                      alert('Fehler: ' + (error.message || String(error)));
                    } else {
                      alert(`Dokument auf Version ${v.version_number} zurückgesetzt`);
                    }
                  }}
                >
                  Zurücksetzen
                </button>
                <button 
                  type="button" 
                  className="glass-btn bg-red-600 hover:bg-red-700"
                  onClick={async () => {
                    if (!confirm(`Alle Versionen VOR Version ${v.version_number} löschen?`)) return;
                    const { error } = await removeOldVersions(v.id);
                    if (error) {
                      alert('Fehler: ' + (error.message || String(error)));
                    } else {
                      alert('Alte Versionen gelöscht');
                    }
                  }}
                >
                  Alte löschen
                </button>
              </div>
            </div>
            {selectedVersion === v.id && (
              <div className="mt-3 space-y-2">
                <ul className="space-y-1">
                  {comments.map((c) => (
                    <li key={c.id} className="text-sm">
                      <span className="font-medium">{new Date(c.created_at).toLocaleString()}:</span> {c.content}
                    </li>
                  ))}
                  {comments.length === 0 && <li className="text-sm text-[var(--text-secondary)]">Keine Kommentare</li>}
                </ul>
                <div className="flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Kommentar schreiben…"
                    className="flex-1 border p-2 rounded"
                  />
                  <button
                    type="button"
                    className="glass-btn"
                    onClick={async () => {
                      if (!commentText || !selectedVersion) return;
                      const { data, error } = await addComment(selectedVersion, commentText);
                      if (!error && data) {
                        setComments((prev) => [...prev, data]);
                        setCommentText('');
                      }
                    }}
                  >
                    Senden
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {versions.length === 0 && (
          <div className="text-sm text-[var(--text-secondary)]">Keine Versionen geladen.</div>
        )}
      </div>
    </div>
  );
}
