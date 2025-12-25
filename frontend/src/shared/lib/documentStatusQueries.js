import supabase from '@/services/supabaseClient';

// Get all document statuses for a project
export async function getDocumentStatuses(projectId) {
  const { data, error } = await supabase
    .from('document_statuses')
    .select('*')
    .eq('project_id', projectId)
    .order('name');
  return { data, error };
}

// Create a new document status
export async function createDocumentStatus({ projectId, name, color = null, icon_url = null }) {
  const { data, error } = await supabase
    .from('document_statuses')
    .insert([{ project_id: projectId, name, color, icon_url }])
    .select()
    .maybeSingle();
  return { data, error };
}

// Update document status
export async function updateDocumentStatus(statusId, { name = null, color = null, icon_url = null }) {
  const updates = {};
  if (name !== null) updates.name = name;
  if (color !== null) updates.color = color;
  if (icon_url !== null) updates.icon_url = icon_url;
  
  const { data, error } = await supabase
    .from('document_statuses')
    .update(updates)
    .eq('id', statusId)
    .select()
    .maybeSingle();
  return { data, error };
}

// Delete document status
export async function deleteDocumentStatus(statusId) {
  const { data, error } = await supabase
    .from('document_statuses')
    .delete()
    .eq('id', statusId);
  return { data, error };
}
