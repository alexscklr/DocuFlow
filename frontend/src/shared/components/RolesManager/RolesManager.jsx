import React, { useEffect, useState, useMemo } from 'react';
import { getRoles, addRole, deleteRole, getPermissions, getRolePermissions, addPermissionToRole, removePermissionFromRole } from '@/shared/lib/rolesQueries';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon  
} from '@mui/icons-material';

const ICONS = {
  add: <AddIcon fontSize="small" />,
  delete: <DeleteIcon fontSize="small" />,
  settings: <SettingsIcon fontSize="small" />,
};

export default function RolesManager ({
    title,
    scope,
    organizationId = null,
    projectId = null,
    documentId = null,
    onBack,
    width = '600px',
    minHeiht = '600px',
    height = '800px',
    onRolesChanged,
}) {

  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [newRole, setNewRole] = useState({ name: '', description: '' });

  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [loadingPerms, setLoadingPerms] = useState(false);

  useEffect(() => {
    if (
      (scope === 'organization' && !organizationId) ||
      (scope === 'project' && !projectId) ||
      (scope === 'document' && (!projectId || !documentId))
    ) {
      return;
    }

    const loadRoles = async () => {
      const { data, error } = await getRoles({
        scope,
        organization_id: organizationId,
        project_id: projectId,
        document_id: documentId, 
      });

      if (error) {
        console.error('getRoles error:', error);
        return;
      }

      setRoles(data || []);
    };

    loadRoles();
  }, [scope, organizationId, projectId, documentId]);

  useEffect(() => {
    const loadPermissions = async () => {
      const { data, error } = await getPermissions();
      if (!error) setPermissions(data || []);
    };

    loadPermissions();
  }, []);

  useEffect(() => {
    if (!selectedRoleId) {
      setRolePermissions([]);
      return;
    }

    const loadRolePermissions = async () => {
      setLoadingPerms(true);

      const { data, error } = await getRolePermissions(selectedRoleId);
      if (!error) setRolePermissions(data || []);

      setLoadingPerms(false);
    };

    loadRolePermissions();
  }, [selectedRoleId]);

  const rolePermissionIds = useMemo(
    () => new Set(rolePermissions.map(rp => rp.permission_id)),
    [rolePermissions]
  );

  const togglePermission = async (permissionId) => {
    if (!selectedRoleId) return;

    const hasPermission = rolePermissionIds.has(permissionId);

    if (hasPermission) {
      const { error } = await removePermissionFromRole(selectedRoleId, permissionId);
      if (!error) {
        setRolePermissions(prev =>
          prev.filter(rp => rp.permission_id !== permissionId)
        );
      }
    } else {
      const { data, error } = await addPermissionToRole(
        selectedRoleId,
        permissionId
      );

      if (!error && data) {
        setRolePermissions(prev => [...prev, data]);
      }
    }
  };


  const createRole = async () => {
    if (!newRole.name.trim()) return;

    const payload = {
      name: newRole.name.trim(),
      description: newRole.description || null,
      scope,
      organization_id: organizationId,
      project_id: projectId,
      document_id: documentId,
    };

    const { data, error } = await addRole(payload);

    if (error) {
      console.error('addRole error:', error);
      return;
    }

    setRoles(prev => [...prev, data]);
    setNewRole({ name: '', description: '' });

    onRolesChanged?.();
  };

  const removeRole = async (roleId) => {
    const { error } = await deleteRole(roleId);
    if (!error) {
      setRoles(prev => prev.filter(r => r.id !== roleId));
      if (selectedRoleId === roleId) setSelectedRoleId(null);
    }

    setRoles(prev => prev.filter(role => role.id !== roleId));

    if (selectedRoleId === roleId) {
      setSelectedRoleId(null);
      setRolePermissions([]); 
    }

    onRolesChanged?.();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-white distance-bottom-sm">
        {title}
      </h2>

      {/* Members Invite */}
      <div className="w-full flex justify-between gap-2 distance-bottom-sm">
        <input
          type="text"
          placeholder="Role name"
          value={newRole.name}
          onChange={e =>
            setNewRole(prev => ({ ...prev, name: e.target.value }))
          }
          className="glass w-full px-3 py-2 text-sm bg-transparent outline-none"
        />

        <button
          onClick={() => createRole()}
          className="glass-btn"
        >
          Create
        </button>

        <button
            onClick={onBack}
            className="glass-btn px-3 py-1"
        >
            ←
        </button>
      </div>

      <div className="w-full flex justify-between gap-2 distance-bottom-md">
        <input
          type="text"
          placeholder="Role description"
          value={newRole.description}
          onChange={e =>
            setNewRole(prev => ({ ...prev, description: e.target.value }))
          }
          className="glass w-full px-3 py-2 text-sm bg-transparent outline-none"
        />
      </div>

      <div className="flex gap-6 mt-6">
        
        {/* LEFT: roles list */}
       <div className="w-1/2 space-y-2">
        {roles.map(role => (
          <div
            key={role.id}
            onClick={() => setSelectedRoleId(role.id)}
            className={`
              relative
              glass-flat border rounded-lg px-4 py-3 cursor-pointer distance-bottom-md
              transition
              ${selectedRoleId === role.id
                ? 'border-white/40'
                : 'hover:border-white/20'}
            `}
          >
            {selectedRoleId === role.id && (
              <div className="absolute inset-0 rounded-lg bg-white/10 pointer-events-none" />
            )}

           <div className="flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-white">
                  {role.name}
                </span>

                {role.description && (
                  <span className="text-xs text-white/70">
                    {role.description}
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  removeRole(role.id);
                }}
                className="glass-btn"
                title="Delete role"
              >
                {ICONS.delete}
              </button>
            </div>
          </div> ))}
        </div>

        {/* RIGHT: details / permissions */}
          <div className="w-1/2 space-y-2">
          {permissions
            .filter(p => p.scope === scope)
            .map(permission => {
              const isAssigned = rolePermissionIds.has(permission.id);

              return (
                <div
                  key={permission.id}
                  className={`
                    relative
                    flex justify-between items-center
                    px-3 py-2 rounded-lg
                    glass-flat border distance-bottom-sm
                    transition
                    ${isAssigned
                      ? 'border-green-500/40'
                      : 'border-white/10 hover:border-white/20'}
                  `}
                >
                  {isAssigned && (
                    <div className="absolute inset-0 rounded-lg bg-green-500/10 pointer-events-none" />
                  )}

                  <span className="text-sm text-white">
                    {permission.permission}
                  </span>

                  <button
                    onClick={() => togglePermission(permission.id)}
                    className="glass-btn"
                    disabled={!selectedRoleId}
                  >
                    {isAssigned ? <DeleteIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}