import React, { useEffect, useState } from 'react';
import MembersInfo from '../MembersInfo/MembersInfo';
import { getRoles } from '@/shared/lib/rolesQueries';
import { useProjectMembers  } from '@/shared/hooks/useProjectMembers';
import { sendProjectInvite  } from '@/shared/lib/inviteQueries';
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

export default function MembersProjectDialog({
  title,
  onClose,
  projectId,
  width = '800px',
  minHeiht = '800px',
  height = '800px',
}) {
  const {
    members,
    loadMembers,
    updateMember,
    removeMember,
  } = useProjectMembers(projectId);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRoleId, setInviteRoleId] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState(null);
  const [roles, setRoles] = useState([]);
  const [view, setView] = useState('members');

  const normalizedEmail = inviteEmail.trim();
  const canInvite = Boolean(inviteRoleId && normalizedEmail && !inviteLoading);

  const loadRoles = async () => {
    if (!projectId) return;

    const { data } = await getRoles({
      scope: 'project',
      project_id: projectId,
    });

    setRoles(
      (data || []).map(role => ({
        id: role.id,
        label: ROLE_LABELS[role.name] ?? role.name,
      }))
    );
  };

  useEffect(() => {
    loadRoles();
  }, [projectId]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);
   
  const handleRoleChange = async (member, newRoleId) => {
    if (member.role_id === newRoleId) return;
    await updateMember(member.id, { role_id: newRoleId });
  };

  const handleInvite = async () => {
    if (!canInvite) return;

    setInviteLoading(true);
    setInviteUrl(null);

    const { data: token, error } = await sendProjectInvite({
      project_id: projectId,
      email: normalizedEmail,
      role_id: inviteRoleId,
    });

    setInviteLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (token) {
      setInviteUrl(`${window.location.origin}/invite?token=${token}`);
      setInviteEmail('');
      setInviteRoleId('');
    }
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

          {/* Invite row */}
          <div className="w-full flex gap-2 distance-bottom-sm">
            {/*Dropdown with users from project*/}
            <input
              type="email"
              placeholder="Email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="glass w-full px-3 py-2 text-sm bg-transparent outline-none"
            />

            <Dropdown
              value={inviteRoleId}
              roles={roles}
              onChange={setInviteRoleId}
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
            onClick={handleInvite}
            disabled={!canInvite}
            className={`glass-btn ${!canInvite ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {inviteLoading ? '...' : 'Invite'}
            </button>
          </div>
          

          {inviteUrl && ( 
            <div className="glass p-3 rounded-lg mb-4 space-y-2 distance-bottom-md"> 
              <p className="text-green-400 text-sm font-semibold"> ✓ Invite created </p> 
              <input type="text" value={inviteUrl} readOnly className="glass w-full px-3 py-2 text-xs bg-transparent distance-bottom-sm" /> 
              <div className="flex gap-2 justify-between"> 
                <button onClick={() => setInviteUrl(null)} className="glass-btn px-3 py-1 text-sm" > Clear </button>
                <button onClick={() => navigator.clipboard.writeText(inviteUrl)} className="glass-btn px-3 py-1 text-sm" > Copy link </button> 
              </div> 
            </div> 
          )}

          <div className="mt-6 max-h-[600px] overflow-y-auto no-scrollbar">
            {members.map(member => (
              <MembersInfo
                key={member.id}
                member={member}
                roles={roles}
                onRoleChange={handleRoleChange}
                onRemove={() => removeMember(member.id)}
              />
            ))}
          </div>
        </>
      )}

      {view === 'roles' && (
        <RolesManager
          title="Manage Roles"
          scope="project"
          projectId={projectId}
          onBack={() => setView('members')}
          onRolesChanged={loadRoles}
        />
      )}
    </div>
  );
}
