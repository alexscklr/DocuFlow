import React, { useEffect, useState } from 'react';
import MembersInfo from '../MembersInfo/MembersInfo';
import { getRoles } from '@/shared/lib/rolesQueries';
import { useOrganizationMembers } from '@/shared/hooks/useOrganizationMembers';
import { sendOrganizationInvite } from '@/shared/lib/inviteQueries';
import Dropdown from '../Dropdown/Dropdown';

export const ROLE_LABELS = {
  organization_owner: 'Owner',
  organization_admin: 'Admin',
  organization_moderator: 'Moderator',
  organization_viewer: 'Viewer',
};

export default function MembersDialog({
  title,
  onClose,
  onInvite,
  organizationId,
  width = '600px',
  minHeiht = '600px',
  height = '800px',
}) {

  const {
    members,
    loading,
    error,
    loadMembers,
    updateMember
  } = useOrganizationMembers(organizationId);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRoleId, setInviteRoleId] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState(null);
  const [roles, setRoles] = useState([]);

  const normalizedEmail = inviteEmail.trim();
  const canInvite = Boolean(inviteRoleId && normalizedEmail && !inviteLoading);

  const handleRoleChange = async (member, newRoleId) => {
    if (member.role_id === newRoleId) return;

    await updateMember(member.id, {
      role_id: newRoleId,
    });
  };
  
  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  useEffect(() => {
    if (!organizationId) return;

    const loadRoles = async () => {
      const { data } = await getRoles({
        scope: 'organization',
        organization_id: organizationId,
      });

      const uiRoles = (data || []).map(role => ({
        id: role.id,
        label: ROLE_LABELS[role.name] ?? role.name,
      }));

      setRoles(uiRoles);
    };

    loadRoles();
  }, [organizationId]);

  const handleInvite = async () => {
  if (!canInvite) return;

  setInviteLoading(true);
  setInviteUrl(null);

  const { data: token, error } = await sendOrganizationInvite({
    organization_id: organizationId,
    email: normalizedEmail,
    role_id: inviteRoleId,
  });

  setInviteLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  if (token) {
    const url = `${window.location.origin}/invite?token=${token}`;
    setInviteUrl(url);

    setInviteEmail('');
    setInviteRoleId('');
  }
};

  return (
    <div
      style={{ maxWidth: width, maxHeight: height, minHeight: minHeiht }}
      className="w-full border glass rounded-lg p-6"
    >
      <h2 className="text-lg font-semibold text-white distance-bottom-sm">
        {title}
      </h2>

      {/* Members Invite */}
      <div className="w-full flex justify-between gap-4 distance-bottom-md">
        <input
          type="email"
          placeholder="Email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          className="glass w-full px-3 py-2 text-sm bg-transparent outline-none"
        />

        {/* Role */}
        <Dropdown
          value={inviteRoleId}
          roles={roles}
          onChange={setInviteRoleId}
          variant="invite"
        />

        {/* Invite */}
        <button
          onClick={handleInvite}
          disabled={!canInvite}
          className={`
            glass-btn px-4 py-1
            ${!canInvite ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {inviteLoading ? '...' : 'Invite'}
        </button>

        <button
          onClick={onClose}
          className={`
            glass-btn px-4 py-1
          `}
        >
          X
        </button>
      </div>

      {inviteUrl && (
        <div className="glass p-3 rounded-lg mb-4 space-y-2 distance-bottom-md">
          <p className="text-green-400 text-sm font-semibold">
            ✓ Invite created
          </p>

          <input
            type="text"
            value={inviteUrl}
            readOnly
            className="glass w-full px-3 py-2 text-xs bg-transparent distance-bottom-sm"
          />

          <div className="flex gap-2 justify-between">
            <button
              onClick={() => setInviteUrl(null)}
              className="glass-btn px-3 py-1 text-sm"
            >
              Clear
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(inviteUrl)}
              className="glass-btn px-3 py-1 text-sm"
            >
              Copy link
            </button>
          </div>
        </div>
      )}

      {/* Members list - Placeholder for actual members */}
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
    </div>
  );
  
}