import { supabase } from '@/services/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

export async function getDocumentVersions(documentId) {
  const { data, error } = await supabase
    .from('document_versions')
    .select('*')
    .eq('document_id', documentId)
    .order('version_number', { ascending: false });
  return { data, error };
}


export async function uploadDocumentFile({
  organizationId,
  projectId,
  documentId,
  file,
  //userId
}) {
  if (!organizationId) throw new Error('Missing organizationId');
  if (!projectId) throw new Error('Missing projectId');
  if (!documentId) throw new Error('Missing documentId');

  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;

  // Pfad: organizationId/projectId/documentId/fileName
  const filePath = `${organizationId}/${projectId}/${documentId}/${fileName}`;

  const { error } = await supabase.storage
    .from('documents')
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type,
      //owner: userId
    });

  if (error) throw error;

  return filePath;
}



export async function createDocumentVersion({
  documentId,
  filePath,
  changeNote = null
}) {
  const { data, error } = await supabase.rpc(
    'create_document_version',
    {
      p_document_id: documentId,
      p_file_path: filePath,
      p_change_note: changeNote
    }
  );

  if (error) throw error;

  return Array.isArray(data) ? data[0] : data;
}


export async function getVersionComments(versionId) {
  const { data, error } = await supabase
    .from('document_comments')
    .select('*')
    .eq('version_id', versionId)
    .order('created_at', { ascending: true });

  return { data, error };
}

export async function addVersionComment({ version_id, content }) {
  const { data, error } = await supabase
    .rpc("create_version_comment", {
      p_version_id: version_id,
      p_content: content
    });

  return { data, error };
}

// Update a version comment
export async function updateVersionComment(commentId, content) {
  const { data, error } = await supabase
    .from('document_comments')
    .update({ content })
    .eq('id', commentId)
    .select()
    .single();

  return { data, error };
}

// Delete a version comment
export async function deleteVersionComment(commentId) {
  const { error } = await supabase
    .from('document_comments')
    .delete()
    .eq('id', commentId);

  return { error };
}

// Create a signed URL for downloading a stored document version file
export async function getVersionSignedUrl(filePath, expiresInSeconds = 3600) {
  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, expiresInSeconds);
  // data.signedUrl contains the full URL
  return { data, error };
}

// Download the file as a Blob (useful for programmatic downloads)
export async function downloadVersionFile(filePath) {
  const { data, error } = await supabase.storage
    .from('documents')
    .download(filePath);
  // data is a Blob
  return { data, error };
}

// Delete all versions older than the target version (from start up to target)
export async function deleteOldVersions(targetVersionId) {
  const { data, error } = await supabase.rpc(
    'delete_old_versions',
    { p_target_version_id: targetVersionId }
  );
  return { data, error };
}

// Revert document to a specific version (deletes all versions after target)
export async function revertDocumentToVersion(targetVersionId) {
  const { data, error } = await supabase.rpc(
    'revert_document_to_version',
    { p_target_version_id: targetVersionId }
  );
  return { data, error };
}