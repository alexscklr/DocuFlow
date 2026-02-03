import { useState, useEffect } from 'react';
import { useDocumentStatuses } from '@/shared/hooks/useDocumentStatuses';

export default function DocumentStatusDialog({
  width = '520px',
  title = 'Select Document Status',
  projectId,
  currentStatusId = null,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  loading = false,
}) {
  const { statuses, loadStatuses } = useDocumentStatuses(projectId);
  const [selectedStatusId, setSelectedStatusId] = useState(currentStatusId);

  useEffect(() => {
    if (projectId) {
      loadStatuses();
    }
  }, [projectId, loadStatuses]);

  useEffect(() => {
    setSelectedStatusId(currentStatusId);
  }, [currentStatusId]);

  const handleSubmit = () => {
    if (selectedStatusId) {
      onSubmit({ statusId: selectedStatusId });
    }
  };

  return (
    <div
      style={{ maxWidth: width }}
      className="w-full border glass rounded-lg p-6"
    >
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold text-white distance-bottom-sm">
          {title}
        </h2>

        <div className="w-full distance-bottom-md max-h-80 overflow-y-auto">
          {statuses.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No statuses available
            </p>
          ) : (
            <div className="space-y-2 ">
              {statuses.map((status) => (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => setSelectedStatusId(status.id)}
                  className={`
                    w-full px-4 py-3 rounded-lg border transition-colors text-left distance-bottom-sm
                    ${selectedStatusId === status.id
                      ? 'border-white/40 bg-white/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 ">
                    {status.color && (
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: status.color }}
                      />
                    )}
                    <span className="text-sm text-white font-medium">
                      {status.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="w-full flex justify-between gap-4 pt-2">
          <button
            onClick={onCancel}
            className="glass-btn px-4 py-1"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedStatusId || loading}
            className={`
              glass-btn px-4 py-1
              ${!selectedStatusId || loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
