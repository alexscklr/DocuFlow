import { useEffect, useState, useCallback } from 'react';
import { getRoles, addRole, deleteRole, getPermissions, getRolePermissions, addPermissionToRole, removePermissionFromRole } from '@/shared/lib/rolesQueries';

export default function RolesManager({ scope = 'organization', organizationId = null, projectId = null }) {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [rolePerms, setRolePerms] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: r } = await getRoles({ scope, organization_id: organizationId, project_id: projectId });
    const { data: p } = await getPermissions();
    setRoles(r || []);
    setPermissions(p || []);
    setLoading(false);
  }, [scope, organizationId, projectId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const loadPerms = async () => {
      if (!selectedRoleId) { setRolePerms([]); return; }
      const { data } = await getRolePermissions(selectedRoleId);
      setRolePerms(data || []);
    };
    loadPerms();
  }, [selectedRoleId]);

  const createRole = async () => {
    if (!newRole.name.trim()) return;
    const { data, error } = await addRole({ name: newRole.name, description: newRole.description, scope, organization_id: organizationId, project_id: projectId });
    if (!error && data) {
      setRoles(prev => [...prev, data]);
      setNewRole({ name: '', description: '' });
    }
  };

  const removeRole = async (roleId) => {
    const { error } = await deleteRole(roleId);
    if (!error) {
      setRoles(prev => prev.filter(r => r.id !== roleId));
      if (selectedRoleId === roleId) setSelectedRoleId(null);
    }
  };

  const addPerm = async (permission_id) => {
    if (!selectedRoleId) return;
    const { data, error } = await addPermissionToRole(selectedRoleId, permission_id);
    if (!error && data) setRolePerms(prev => [...prev, data]);
  };

  const removePerm = async (role_permission_id) => {
    const { error } = await removePermissionFromRole(role_permission_id);
    if (!error) setRolePerms(prev => prev.filter(rp => rp.id !== role_permission_id));
  };

  return (
    <div className="glass p-4 rounded-xl flex flex-col gap-4">
      <h3 className="font-semibold">Rollen verwalten ({scope})</h3>
      <div className="flex flex-wrap gap-2 items-end">
        <input
          type="text"
          placeholder="Rollenname"
          value={newRole.name}
          onChange={e => setNewRole(v => ({ ...v, name: e.target.value }))}
          className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
        />
        <input
          type="text"
          placeholder="Beschreibung (optional)"
          value={newRole.description}
          onChange={e => setNewRole(v => ({ ...v, description: e.target.value }))}
          className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-primary)]"
        />
        <button className="glass glass-btn" onClick={createRole} disabled={loading}>Rolle erstellen</button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <h4 className="font-medium">Rollen</h4>
          <ul className="space-y-2">
            {roles.map(r => (
              <li key={r.id} className="flex items-center justify-between p-2 rounded border border-[var(--border)] bg-[var(--bg-tertiary)]">
                <span onClick={() => setSelectedRoleId(r.id)} className="cursor-pointer">
                  {r.name} <span className="text-[var(--text-secondary)] text-xs">{r.description}</span>
                </span>
                <button className="glass glass-btn" onClick={() => removeRole(r.id)}>Löschen</button>
              </li>
            ))}
            {roles.length === 0 && <li className="italic text-sm text-[var(--text-secondary)]">Keine Rollen</li>}
          </ul>
        </div>
        <div className="flex-1">
          <h4 className="font-medium">Rechte</h4>
          <div className="flex flex-wrap gap-2">
            {permissions.map(p => (
              <button key={p.id} className="glass glass-btn" onClick={() => addPerm(p.id)} disabled={!selectedRoleId}>
                + {p.name}
              </button>
            ))}
          </div>
          <h4 className="font-medium mt-3">Rechte der Rolle</h4>
          <ul className="space-y-2">
            {rolePerms.map(rp => (
              <li key={rp.id} className="flex items-center justify-between p-2 rounded border border-[var(--border)] bg-[var(--bg-tertiary)]">
                <span>{rp.permissions?.name || rp.permission_id}</span>
                <button className="glass glass-btn" onClick={() => removePerm(rp.id)}>Entfernen</button>
              </li>
            ))}
            {selectedRoleId && rolePerms.length === 0 && <li className="italic text-sm text-[var(--text-secondary)]">Keine Rechte für diese Rolle</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
