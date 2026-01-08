import { supabase } from '@/services/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// Upload a document file to storage
export async function uploadDocumentFileToStorage({
  organizationId,
  projectId,
  documentId,
  file
}) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;

  const filePath = `${organizationId}/${projectId}/${documentId}/${fileName}`;

  const { error } = await supabase.storage
    .from('documents')
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type
    });

  if (error) throw error;

  return filePath;
}

// Download a document file from storage
export async function downloadDocumentFile(filePath) {
  const { data, error } = await supabase.storage
    .from('documents')
    .download(filePath);
  
  return { data, error };
}

// Get signed URL for downloading
export async function getDocumentSignedUrl(filePath, expiresInSeconds = 3600) {
  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, expiresInSeconds);
  
  return { data, error };
}
