import { useEffect, useState, useCallback } from 'react';
import { getDocumentsOfProject, createDocument, updateDocument, deleteDocument } from '@/shared/lib/documentQueries';

export function useDocuments(projectId) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDocuments = useCallback(async () => {
    if (!projectId) {
      setDocuments([]);
      return [];
    }
    setLoading(true);
    setError(null);
    const { data, error } = await getDocumentsOfProject(projectId);
    setLoading(false);
    if (error) {
      setError(error);
      return [];
    }
    setDocuments(data || []);
    return data || [];
  }, [projectId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const addDocument = useCallback(async ({ title, status_id = null }) => {
    if (!projectId) return { data: null, error: new Error('Missing projectId') };
    const { data, error } = await createDocument({ project_id: projectId, title, status_id });
    if (!error && data) setDocuments(prev => [data, ...prev]);
    return { data, error };
  }, [projectId]);

  const editDocument = useCallback(async (documentId, updates) => {
    const { data, error } = await updateDocument(documentId, updates);
    if (!error && data) {
      setDocuments(prev => prev.map(d => d.id === documentId ? { ...d, ...data } : d));
    }
    return { data, error };
  }, []);

  const removeDocument = useCallback(async (documentId) => {
    const { error } = await deleteDocument(documentId);
    if (!error) setDocuments(prev => prev.filter(d => d.id !== documentId));
    return { error };
  }, []);

  return { documents, loading, error, loadDocuments, addDocument, editDocument, removeDocument };
}
