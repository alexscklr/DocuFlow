import { useEffect, useState } from 'react';
import { useDocumentShares } from '@/shared/hooks/useDocumentShares';
import { useProjectMembers } from '@/shared/hooks/useProjectMembers';
import { getRoles } from '@/shared/lib/rolesQueries';

export default function DocumentShares({ documentId, projectId }) {
  const { shares, loading, error, loadShares, addShare, removeShare } = useDocumentShares(documentId);
  const { members } = useProjectMembers(projectId);
  const [roles, setRoles] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [sharing, setSharing] = useState(false);

  // Load roles
  useEffect(() => {
    const loadRoles = async () => {
      const { data } = await getRoles({ scope: 'project', project_id: projectId });
      setRoles(data || []);
    };
    if (projectId) loadRoles();
  }, [projectId]);

  // Load shares on mount or when documentId changes
  useEffect(() => {
    if (documentId) {
      loadShares();
    }
  }, [documentId, loadShares]);

  const handleShare = async () => {
    if (!selectedUserId) return;
    setSharing(true);
    const { error: err } = await addShare({
      userId: selectedUserId,
      roleId: selectedRoleId || null
    });
    setSharing(false);
    if (err) {
      alert('Fehler beim Teilen: ' + (err.message || String(err)));
    } else {
      setSelectedUserId('');
      setSelectedRoleId('');
    }
  };

  // Filter out already shared members
  const sharedUserIds = shares.map(s => s.user_id);
  const availableMembers = members.filter(m => !sharedUserIds.includes(m.user_id));

  if (!documentId || !projectId) {
    return <div className="text-sm text-[var(--text-secondary)]">Dokument und Projekt erforderlich</div>;
  }

  return (
    <div className="space-y-4 glass p-4 rounded-xl">
      <h3 className="text-lg font-bold">Dokument teilen</h3>

      {error && (
        <div className="text-red-500 text-sm">{error.message || String(error)}</div>
      )}

      {/* Share form */}
      <div className="flex flex-col gap-3 border-b pb-4">
        <label className="block">
          <span className="text-sm font-medium">Projektmitglied</span>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="">-- Wähle ein Mitglied --</option>
            {availableMembers.map(m => (
              <option key={m.user_id} value={m.user_id}>
                {m.display_name || m.user_id}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Rolle (optional)</span>
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="">-- Keine Rolle --</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={handleShare}
          disabled={!selectedUserId || sharing || loading}
          className="glass-btn"
        >
          {sharing ? 'Teile…' : 'Teilen'}
        </button>
      </div>

      {/* Shares list */}
      <div>
        <h4 className="font-semibold text-sm mb-2">Geteilt mit ({shares.length})</h4>
        {shares.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">Dieses Dokument wurde nicht geteilt.</p>
        ) : (
          <ul className="space-y-2">
            {shares.map(share => (
              <li
                key={share.id}
                className="border rounded p-2 flex items-center justify-between bg-[var(--bg-secondary)]"
              >
                <div className="text-sm">
                  <div className="font-medium">
                    {share.profiles?.display_name || share.profiles?.email || share.user_id}
                  </div>
                  {share.role_id && (
                    <div className="text-xs text-[var(--text-secondary)]">
                      Rolle ID: {share.role_id}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeShare(share.id)}
                  disabled={loading}
                  className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
