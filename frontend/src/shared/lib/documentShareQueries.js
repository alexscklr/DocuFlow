import { supabase } from '@/services/supabaseClient.js';

// Share document with a project member
export async function shareDocument({ documentId, userId, roleId = null }) {
  const payload = {
    p_document_id: documentId,
    p_user_id: userId,
    p_role_id: roleId
  };
  const { data, error } = await supabase.rpc('share_document', payload);
  return { data, error };
}

// Get all shares for a document
export async function getDocumentShares(documentId) {
  const { data, error } = await supabase
    .from('document_shares')
    .select('*, user_profiles(display_name, email)')
    .eq('document_id', documentId)
    .order('created_at', { descending: true });
  return { data, error };
}

// Revoke document share
export async function revokeDocumentShare(shareId) {
  const { data, error } = await supabase.rpc(
    'revoke_document_share',
    { p_share_id: shareId }
  );
  return { data, error };
}
