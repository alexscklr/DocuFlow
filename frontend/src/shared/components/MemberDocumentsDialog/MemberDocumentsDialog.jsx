import React, { useEffect, useState } from 'react';
import MembersInfo from '../MembersInfo/MembersInfo';
import { getRoles } from '@/shared/lib/rolesQueries';
import { useDocumentShares } from '@/shared/hooks/useDocumentShares';
import { useProjectMembers } from '@/shared/hooks/useProjectMembers';
import Dropdown from '../Dropdown/Dropdown';
import { RolesManager } from '@/shared/components';
import { Settings as SettingsIcon } from '@mui/icons-material';

const ICONS = {
  settings: <SettingsIcon fontSize="small" />,
};

export const ROLE_LABELS = {
  project_owner: 'Owner',
  project_admin: 'Admin',
  project_moderator: 'Moderator',
  project_viewer: 'Viewer',
};

export default function MemberDocumentsDialog({
  title,
  onClose,
  documentId,
  projectId,
  width = '800px',
  minHeiht = '800px',
  height = '800px',
}) {

  const { members, loadMembers } = useProjectMembers(projectId);
  const { shares, loading, error, loadShares, addShare, removeShare } = useDocumentShares(documentId);

  const [roles, setRoles] = useState([]);
  const [view, setView] = useState('members');

  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [sharing, setSharing] = useState(false);
  
  useEffect(() => {
    if (projectId) loadMembers();
  }, [projectId, loadMembers]);

  useEffect(() => {
    if (documentId) loadShares();
  }, [documentId, loadShares]);

  useEffect(() => {
    let isActive = true;

    if (!projectId) return;

    const loadRoles = async () => {
      const { data } = await getRoles({
        scope: 'document',
        project_id: projectId,
      });

      if (!isActive) return; 

      setRoles(data || []);
    };

    loadRoles();

    return () => {
      isActive = false; 
    };
  }, [projectId]);


  const sharedUserIds = shares.map(s => s.user_id);
  const availableMembers = members.filter(
    m => !sharedUserIds.includes(m.user_id)
  );
  
  const roleOptions = roles.map(role => ({
    value: role.id,
    label: role.name, 
}));

  const handleShare = async () => {
    if (!selectedUserId) return;

    setSharing(true);

    const { error } = await addShare({
      userId: selectedUserId,
      roleId: selectedRoleId || null, // ← ВОТ ТУТ роль
    });

    setSharing(false);

    if (error) {
      alert(error.message || 'Failed to share document');
      return;
    }

    setSelectedUserId('');
    setSelectedRoleId('');
  };

  const handleRoleChange = async (member, newRoleId) => {
    if (member.role_id === newRoleId) return;
    await updateMember(member.id, { role_id: newRoleId });
  };

  return (
    <div
      style={{ maxWidth: width, maxHeight: height, minHeight: minHeiht }}
      className="w-full border glass rounded-lg p-6"
    >
      {view === 'members' && (
        <>
          <h2 className="text-lg font-semibold text-white distance-bottom-sm">
            {title}
          </h2>

          {/* SHARE FORM */}
          <div className="w-full flex gap-2 distance-bottom-sm">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="glass w-full px-3 py-2 text-sm bg-transparent outline-none"
            >
              <option value="">Select project member</option>
              {availableMembers.map(m => (
                <option key={m.user_id} value={m.user_id}>
                  {m.display_name || m.email || m.user_id}
                </option>
              ))}
            </select>

            <Dropdown
              className="dropdown-fit"
              value={selectedRoleId}
              roles={roleOptions}
              onChange={setSelectedRoleId}
              variant="invite"
            />

            <button
              onClick={() => setView('roles')}
              className="glass-btn"
              title="Manage roles"
            >
              {ICONS.settings}
            </button>

            <button onClick={onClose} className="glass-btn px-4 py-1">
              X
            </button>
          </div>

          <div className="w-full flex justify-between gap-2 distance-bottom-md">
            <button
              onClick={handleShare}
              disabled={!selectedUserId || sharing || loading}
              className={`glass-btn ${
                !selectedUserId ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {sharing ? 'Sharing…' : 'Share'}
            </button>
          </div>
          
          <div className="mt-6 max-h-[600px] overflow-y-auto no-scrollbar">
            {members.map(member => (
              <MembersInfo
                key={member.id}
                member={member}
                roles={roles}
                onRoleChange={handleRoleChange}
              />
            ))}
          </div>
        </>
      )}

      {view === 'roles' && (
        <RolesManager
          title="Manage Roles"
          scope="document"
          projectId={projectId}
          documentId={documentId}
          onBack={() => setView('members')}
        />
      )}
    </div>
  );
}
