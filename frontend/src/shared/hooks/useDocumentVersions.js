import { useEffect, useState, useCallback } from 'react';
import {
  getDocumentVersions,
  createDocumentVersion,
  getVersionComments,
  addVersionComment,
  uploadDocumentFile,
  getVersionSignedUrl,
  downloadVersionFile,
  deleteOldVersions,
  revertDocumentToVersion
} from '@/shared/lib/documentVersionsQueries';
//import { useAuthSession } from '@/shared/hooks/useAuthSession';

export function useDocumentVersions(documentId) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //const { user } = useAuthSession();

  const loadVersions = useCallback(async () => {
    if (!documentId) {
      setVersions([]);
      return [];
    }
    setLoading(true);
    setError(null);
    const { data, error } = await getDocumentVersions(documentId);
    setLoading(false);
    if (error) {
      setError(error);
      return [];
    }
    setVersions(data || []);
    return data || [];
  }, [documentId]);

  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  const addVersion = useCallback(async ({ filePath, changeNote = null }) => {
    if (!documentId) return { data: null, error: new Error('Missing documentId') };
    const { data, error } = await createDocumentVersion({ documentId, filePath, changeNote });
    if (!error && data) setVersions(prev => [data, ...prev]);
    return { data, error };
  }, [documentId]);

  const uploadAndCreateVersion = useCallback(
    async ({ organizationId = null, projectId, file, changeNote = 'Initial upload' }) => {
      if (!documentId) {
        return { data: null, error: new Error('Missing documentId') };
      }

      if (!projectId) {
        return { data: null, error: new Error('Missing projectId') };
      }

      // 🔐 Upload (owner NICHT setzen!)
      const filePath = await uploadDocumentFile({
        organizationId,
        projectId,
        documentId,
        file,
        //userId: user?.id || null
      });

      const { data, error } = await createDocumentVersion({
        documentId,
        filePath,
        changeNote,
      });

      if (!error && data) {
        setVersions(prev => [data, ...prev]);
      }

      return { data, error };
    },
    [documentId]
  );

  const loadComments = useCallback(async (versionId) => {
    const { data, error } = await getVersionComments(versionId);
    return { data: data || [], error };
  }, []);

  const addComment = useCallback(async (versionId, content) => {
    const { data, error } = await addVersionComment({ version_id: versionId, content });
    return { data, error };
  }, []);

  // Get a signed URL for a version's file path
  const getSignedUrl = useCallback(async (filePath, expiresInSeconds = 3600) => {
    const { data, error } = await getVersionSignedUrl(filePath, expiresInSeconds);
    return { url: data?.signedUrl || null, error };
  }, []);

  // Download a version file as Blob
  const downloadFile = useCallback(async (filePath) => {
    const { data, error } = await downloadVersionFile(filePath);
    return { blob: data || null, error };
  }, []);

  // Delete all versions older than target version
  const removeOldVersions = useCallback(async (targetVersionId) => {
    const { data, error } = await deleteOldVersions(targetVersionId);
    if (!error) {
      // Reload versions to reflect changes
      await loadVersions();
    }
    return { data, error };
  }, [loadVersions]);

  // Revert document to target version (removes all newer versions)
  const revertToVersion = useCallback(async (targetVersionId) => {
    const { data, error } = await revertDocumentToVersion(targetVersionId);
    if (!error) {
      // Reload versions to reflect changes
      await loadVersions();
    }
    return { data, error };
  }, [loadVersions]);

  return {
    versions, loading, error,
    loadVersions, addVersion, uploadAndCreateVersion,
    loadComments, addComment,
    getSignedUrl, downloadFile,
    removeOldVersions, revertToVersion
  };
}
