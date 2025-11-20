import supabase from "@/services/supabaseClient";

export const createOrganization = async (name, description) => {
    const { data, error } = await supabase.rpc('create_organization', {
        neworg_name: name,
        neworg_description: description
    });

    // Coerce result to a single object when function returns one row
    const single = Array.isArray(data) ? data?.[0] ?? null : data ?? null;
    return { data: single, error };
}

export const getOrganizations = async () => {
    const { data, error } = await supabase
        .from('organizations')
        .select('*');
    return { data, error };
}

export const getProjectsByOrganization = async (organizationId) => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', organizationId);
    return { data, error };
}

export const getPermissionsForRole = async (roleId) => {
    const { data, error } = await supabase
        .from('role_permissions')
        .select('permission_id, permissions(permission)')
        .eq('role_id', roleId);
    return { data, error };
}

export const updateOrganization = async (orgId, updates) => {
    const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', orgId);
    return { data, error };
}

export const deleteOrganization = async (orgId) => {
    // If your DB doesn't have ON DELETE CASCADE for all related tables,
    // prefer creating a Postgres function (RPC) to perform a safe cascade delete
    // with proper permission checks (owner/admin only).
    const { data, error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', orgId)
        .select()
        .maybeSingle();
    return { data, error };
}