import { useState, useCallback } from 'react';
import { getDocumentStatuses, createDocumentStatus, updateDocumentStatus, deleteDocumentStatus } from '@/shared/lib/documentStatusQueries';

export function useDocumentStatuses(projectId) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load document statuses for project
  const loadStatuses = useCallback(async () => {
    if (!projectId) return { data: [], error: null };
    setLoading(true);
    setError(null);
    const { data, error: err } = await getDocumentStatuses(projectId);
    if (!err) setStatuses(data ?? []);
    setError(err);
    setLoading(false);
    return { data, error: err };
  }, [projectId]);

  // Create new status
  const addStatus = useCallback(async ({ name, color = null, icon_url = null }) => {
    if (!projectId) return { data: null, error: new Error('projectId required') };
    const { data, error: err } = await createDocumentStatus({ projectId, name, color, icon_url });
    if (!err && data) {
      setStatuses((prev) => [...prev, data]);
    }
    return { data, error: err };
  }, [projectId]);

  // Update status
  const updateStatus = useCallback(async (statusId, updates) => {
    const { data, error: err } = await updateDocumentStatus(statusId, updates);
    if (!err) {
      setStatuses((prev) => prev.map((s) => (s.id === statusId ? { ...s, ...updates } : s)));
    }
    return { data, error: err };
  }, []);

  // Delete status
  const deleteStatus = useCallback(async (statusId) => {
    const { data, error: err } = await deleteDocumentStatus(statusId);
    if (!err) {
      setStatuses((prev) => prev.filter((s) => s.id !== statusId));
    }
    return { data, error: err };
  }, []);

  return {
    statuses,
    loading,
    error,
    loadStatuses,
    addStatus,
    updateStatus,
    deleteStatus,
  };
}
