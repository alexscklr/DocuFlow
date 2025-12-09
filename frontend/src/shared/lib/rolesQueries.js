import supabase from '@/services/supabaseClient';

export async function getRoles({ scope = 'organization', organization_id = null, project_id = null } = {}) {
  let query = supabase.from('roles').select('*');
  if (scope === 'organization' && organization_id) query = query.eq('organization_id', organization_id);
  if (scope === 'project' && project_id) query = query.eq('project_id', project_id);
  const { data, error } = await query;
  return { data, error };
}

export async function addRole({ name, description = null, scope = 'organization', organization_id = null, project_id = null }) {
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
