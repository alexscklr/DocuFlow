import React, { useEffect, useState } from 'react';
import MembersInfo from '../MembersInfo/MembersInfo';
import { getRoles } from '@/shared/lib/rolesQueries';
import { useDocumentShares } from '@/shared/hooks/useDocumentShares';
import { useProjectMembers } from '@/shared/hooks/useProjectMembers';
import { UserDropdown } from '..';
import { useAppData } from '@/shared/context/AppDataContextBase';
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

  const { members, loadMembers, updateMember, removeMember } = useProjectMembers(projectId);
  const { shares, loading, error, loadShares, addShare, removeShare } = useDocumentShares(documentId);

  const [roles, setRoles] = useState([]);
  const [view, setView] = useState('members');

  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [sharing, setSharing] = useState(false);

  const { profile: myProfile } = useAppData();
  
  const loadRoles = async () => {
    const { data } = await getRoles({
      scope: 'document',
      project_id: projectId,
    });
    setRoles(data || []);
  };

  useEffect(() => {
    if (projectId) loadRoles();
  }, [projectId]);

  useEffect(() => {
    if (projectId) loadMembers();
  }, [projectId, loadMembers]);

  useEffect(() => {
    if (documentId) loadShares();
  }, [documentId, loadShares]);

  const sharedUserIds = shares.map(s => s.user_id);
  
  const availableMembers = members.filter(m =>
    !sharedUserIds.includes(m.user_id) 
    /*&&
    m.user_id !== myProfile?.id*/
  );
    
  const roleOptions = roles.map(role => ({
    id: role.id,
    label: role.name, 
  }));

  const userOptions = availableMembers.map(m => ({
    id: m.user_id,
    label: m.display_name || m.email || m.user_id,
  }));

  const sharesWithUsers = shares.map(share => {
    const user = members.find(m => m.user_id === share.user_id);

    return {
      ...share,
      display_name: user?.display_name,
      avatar_url: user?.avatar_url,
      user_id: share.user_id,
      role_id: share.role_id,
    };
  });
  
  const handleShare = async () => {
    if (!selectedUserId) return;

    setSharing(true);

    const { error } = await addShare({
      userId: selectedUserId,
      roleId: selectedRoleId || null,
    });

    setSharing(false);

    if (error) {
      alert(error.message || 'Failed to share document');
      return;
    }

    setSelectedUserId('');
    setSelectedRoleId('');
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
            <UserDropdown
              value={selectedUserId}
              users={userOptions}
              onChange={setSelectedUserId}
            />

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
            {sharesWithUsers.map(share  => (
              <MembersInfo
                key={share.id}
                member={share}
                roles={roleOptions}
                onRemove={() => removeShare(share.id)}
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
          onRolesChanged={loadRoles}
        />
      )}
    </div>
  );
}
