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
  const { data, error } = await supabase
    .from('role_permissions')
    .select('id, role_id, permission_id, permissions(id, name, description)')
    .eq('role_id', role_id);
  return { data, error };
}

export async function addPermissionToRole(role_id, permission_id) {
  const { data, error } = await supabase
    .from('role_permissions')
    .insert([{ role_id, permission_id }])
    .select()
    .maybeSingle();
  return { data, error };
}

export async function removePermissionFromRole(role_permission_id) {
  const { data, error } = await supabase
    .from('role_permissions')
    .delete()
    .eq('id', role_permission_id)
    .select('id')
    .maybeSingle();
  return { data, error };
}
