import supabase from "@/services/supabaseClient";

export const createOrganization = async (details) => {
    const { name, description } = details || {};
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
    const { data, error } = await supabase.rpc('delete_organization', { p_org_id: orgId });
    return { data, error };
}