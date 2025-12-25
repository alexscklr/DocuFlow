import supabase from '@/services/supabaseClient';

export async function getRoles({ scope = 'organization', organization_id = null, project_id = null} = {}) {
  let query = supabase.from('roles').select('*');
  
  // Filter by scope first
  if (scope) query = query.eq('scope', scope);
  
  // Then filter by relevant ID based on scope
  if (scope === 'organization') {
    if (organization_id) {
      query = query.eq('organization_id', organization_id);
    } else {
      // Don't return template roles (with NULL organization_id) unless explicitly requested
      return { data: [], error: null };
    }
  }
  
  if (scope === 'project') {
    if (project_id) {
      query = query.eq('project_id', project_id);
    } else {
      // Don't return template roles (with NULL project_id) unless explicitly requested
      return { data: [], error: null };
    }
  }
  
  if (scope === 'document') {
    if (project_id) {
      query = query.eq('project_id', project_id);
    } else {
      // Don't return template roles (with NULL project_id) unless explicitly requested
      return { data: [], error: null };
    }
  }
  
  const { data, error } = await query;
  return { data, error };
}

export async function addRole({ name, description = null, scope = 'organization', organization_id = null, project_id = null}) {
  const payload = { name, description, scope, organization_id, project_id };
  const { data, error } = await supabase.from('roles').insert([payload]).select().maybeSingle();
  return { data, error };
}

export async function deleteRole(role_id) {
  const { data, error } = await supabase.from('roles').delete().eq('id', role_id).select('id').maybeSingle();
  return { data, error };
}

export async function getPermissions() {
  const { data, error } = await supabase.from('permissions').select('*');
  return { data, error };
}

// Fetch permissions for the authenticated user
// Returns: { "organization": { "org-id": ["permission", ...], ... }, "project": {...}, "document": {...} }
export async function getPermissionsOfUser() {
  const { data, error } = await supabase.rpc('get_permissions_of_user');
  return { data, error };
}

export async function getRolePermissions(role_id) {
  if (!role_id) return { data: [], error: null };
  // Prefer eq for single id, but fallback to in() or per-id fetch if API rejects
  let data = null;
  let error = null;
  const { data: d1, error: e1 } = await supabase
    .from('role_permissions')
    .select('role_id, permission_id')
    .eq('role_id', role_id);
  if (!e1) {
    data = d1;
  } else {
    const { data: d2, error: e2 } = await supabase
      .from('role_permissions')
      .select('role_id, permission_id')
      .in('role_id', [role_id]);
    if (!e2) {
      data = d2;
    } else {
      // Final fallback: per-id maybeSingle then normalize to array
      const { data: d3, error: e3 } = await supabase
        .from('role_permissions')
        .select('role_id, permission_id')
        .eq('role_id', role_id)
        .maybeSingle();
      if (!e3 && d3) {
        data = [d3];
      } else {
        error = e3 || e2 || e1;
      }
    }
  }
  return { data, error };
}

export async function addPermissionToRole(role_id, permission_id) {
  const { data, error } = await supabase
    .from('role_permissions')
    .insert([{ role_id, permission_id }])
    .select('role_id, permission_id');
  // select() returns an array; normalize to single entry
  const row = Array.isArray(data) ? data[0] : data;
  return { data: row, error };
}

export async function removePermissionFromRole(role_id, permission_id) {
  const { data, error } = await supabase
    .from('role_permissions')
    .delete()
    .eq('role_id', role_id)
    .eq('permission_id', permission_id)
    .select('role_id, permission_id');
  return { data, error };
}

// Check a permission for a given scope/id against a permissions map.
// Expected shapes under permissions[scope][id]:
// - string[] of permission names
// - Set of permission names
// - { permissions: string[] | Set }
export function hasPermission(permissions, id, scope, permission) {
  if (!id || !scope || !permission) return false;
  const scopePerms = permissions?.[scope];
  if (!scopePerms) return false;
  const entry = scopePerms[id];
  if (!entry) return false;

  if (Array.isArray(entry)) return entry.includes(permission);
  if (entry instanceof Set) return entry.has(permission);
  if (entry.permissions && Array.isArray(entry.permissions)) return entry.permissions.includes(permission);
  if (entry.permissions instanceof Set) return entry.permissions.has(permission);
  return false;
}