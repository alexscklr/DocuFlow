import { useState, useCallback } from 'react';
import { getAllDocuments, createDocument, updateDocument, deleteDocument } from '@/shared/lib/documentQueries';

// useAllDocuments: Hook für alle Documents (nicht projekt-spezifisch)
export function useAllDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Documents laden
  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await getAllDocuments();
    if (!error) setDocuments(data ?? []);
    setError(error);
    setLoading(false);
    return { data, error };
  }, []);

  // Document anlegen (benötigt project_id)
  const addDocumentHandler = useCallback(async (details) => {
    const { data, error } = await createDocument(details);
    if (!error && data) setDocuments((prev) => [data, ...prev]);
    return { data, error };
  }, []);

  // Document aktualisieren
  const updateDocumentHandler = useCallback(async (documentId, updates) => {
    const { data, error } = await updateDocument(documentId, updates);
    if (!error) setDocuments((prev) => prev.map((d) => (d.id === documentId ? { ...d, ...updates } : d)));
    return { data, error };
  }, []);

  // Document löschen
  const deleteDocumentHandler = useCallback(async (documentId) => {
    const { error } = await deleteDocument(documentId);
    if (!error) setDocuments((prev) => prev.filter((d) => d.id !== documentId));
    return { error };
  }, []);

  return {
    documents,
    loading,
    error,
    loadDocuments,
    addDocument: addDocumentHandler,
    updateDocument: updateDocumentHandler,
    deleteDocument: deleteDocumentHandler,
  };
}
