import { supabase } from '@/services/supabaseClient.js';

export async function getDocumentsOfProject(projectId) {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId);
    return { data, error };
}

export async function createDocument({ project_id, title }) {
    const { data, error } = await supabase.rpc('create_empty_document', {
        p_project_id: project_id,
        p_title: title
    });
    console.log('RPC data:', data);
    console.error('RPC error:', error);

    const single = Array.isArray(data) ? data?.[0] ?? null : data ?? null;
    return { data: single, error };
}

export async function updateDocument(documentId, updates) {
    const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single();
    return { data, error };
}
export async function deleteDocument(documentId) {
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

    return { error };
}