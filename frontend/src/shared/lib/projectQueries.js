import supabase from "@/services/supabaseClient";

export const createProject = async ({ organization_id, name, description = null }) => {
  const { data, error } = await supabase.rpc('create_project', { p_name: name, p_organization_id: organization_id, p_description: description });
  console.log("createProject RPC result:", { data, error });
  const single = Array.isArray(data) ? data?.[0] ?? null : data ?? null;
  return { data: single, error };
}

export const updateProject = async (projectId, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();
  return { data, error };
}

export const deleteProject = async (projectId) => {
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .select()
    .maybeSingle();
  return { data, error };
}
