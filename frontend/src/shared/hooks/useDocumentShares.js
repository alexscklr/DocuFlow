import { useState, useCallback } from 'react';
import { shareDocument, getDocumentShares, revokeDocumentShare } from '@/shared/lib/documentShareQueries';

export function useDocumentShares(documentId) {
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadShares = useCallback(async () => {
    if (!documentId) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await getDocumentShares(documentId);
    if (err) {
      setError(err);
    } else {
      setShares(data || []);
    }
    setLoading(false);
  }, [documentId]);

  const addShare = useCallback(async ({ userId, roleId = null }) => {
    if (!documentId) return;
    const { data, error: err } = await shareDocument({ documentId, userId, roleId });
    if (err) {
      setError(err);
      return { data, error: err };
    }
    // Reload shares after adding
    await loadShares();
    return { data };
  }, [documentId, loadShares]);

  const removeShare = useCallback(async (shareId) => {
    const { data, error: err } = await revokeDocumentShare(shareId);
    if (err) {
      setError(err);
      return { data, error: err };
    }
    // Reload shares after removing
    await loadShares();
    return { data };
  }, [loadShares]);

  return {
    shares,
    loading,
    error,
    loadShares,
    addShare,
    removeShare
  };
}
