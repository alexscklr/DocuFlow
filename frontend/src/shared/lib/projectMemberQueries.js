import supabase from '@/services/supabaseClient';

export const getProjectMembers = async (projectId) => {
  const { data, error } = await supabase
    .from('project_members')
    .select('*')
    .eq('project_id', projectId);
  return { data, error };
};

export const addProjectMember = async ({ project_id, user_id, role_id = null }) => {
  const { data, error } = await supabase
    .from('project_members')
    .insert({ project_id, user_id, role_id })
    .select('*')
    .maybeSingle();
  return { data, error };
};

export const updateProjectMember = async (memberId, updates) => {
  const { data, error } = await supabase
    .from('project_members')
    .update(updates)
    .eq('id', memberId)
    .select('*')
    .maybeSingle();
  return { data, error };
};

export const removeProjectMember = async (memberId) => {
  const { data, error } = await supabase
    .from('project_members')
    .delete()
    .eq('id', memberId)
    .select('id')
    .maybeSingle();
  return { data, error };
};
