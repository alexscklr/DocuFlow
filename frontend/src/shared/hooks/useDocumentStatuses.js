import { useState, useCallback } from 'react';
import { getDocumentStatuses, getTemplateStatuses, createDocumentStatus, updateDocumentStatus, deleteDocumentStatus } from '@/shared/lib/documentStatusQueries';

export function useDocumentStatuses(projectId) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load document statuses for project (including template statuses)
  const loadStatuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Immer Template-Statuses laden
    const { data: templateData, error: templateErr } = await getTemplateStatuses();
    let projectData = [];
    let projectErr = null;
    
    // Wenn projectId vorhanden ist, auch Projekt-Statuses laden
    if (projectId) {
      const result = await getDocumentStatuses(projectId);
      projectData = (result.data ?? []).filter(s => s.project_id !== null);
      projectErr = result.error;
    }
    
    if (!templateErr && !projectErr) {
      setStatuses([...projectData, ...templateData]);
    } else {
      setError(templateErr || projectErr);
    }
    setLoading(false);

    console.log('Loaded statuses:', [...projectData, ...templateData]);

    return { data: [...projectData, ...templateData], error: templateErr || projectErr };
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
