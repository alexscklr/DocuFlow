import { useState, useEffect } from 'react';
import { getVersionComments, addVersionComment, updateVersionComment, deleteVersionComment } from '@/shared/lib/documentVersionsQueries';

export default function VersionCommentDialog({
  width = '520px',
  title,
  versionId,
  versionNumber,
  onCancel,
  onCommentAdded,
}) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Load comments when dialog opens
  useEffect(() => {
    if (versionId) {
      loadComments();
    }
  }, [versionId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await getVersionComments(versionId);
      if (!error && data) {
        setComments(data || []);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !versionId) return;

    setSubmitting(true);
    try {
      const { data, error } = await addVersionComment({
        version_id: versionId,
        content: newComment.trim()
      });

      if (!error && data) {
        setComments(prev => [...prev, data]);
        setNewComment('');
        if (onCommentAdded) {
          onCommentAdded();
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(`Error adding comment: ${error.message || error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const handleSaveEdit = async (commentId) => {
    if (!editCommentText.trim()) return;

    try {
      const { data, error } = await updateVersionComment(commentId, editCommentText.trim());
      
      if (!error && data) {
        setComments(prev => prev.map(c => c.id === commentId ? data : c));
        setEditingCommentId(null);
        setEditCommentText('');
        if (onCommentAdded) {
          onCommentAdded();
        }
      } else {
        alert(`Error updating comment: ${error?.message || error}`);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert(`Error updating comment: ${error.message || error}`);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setDeleting(commentId);
    try {
      const { error } = await deleteVersionComment(commentId);
      
      if (!error) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        if (onCommentAdded) {
          onCommentAdded();
        }
      } else {
        alert(`Error deleting comment: ${error?.message || error}`);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(`Error deleting comment: ${error.message || error}`);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div
      style={{ maxWidth: width }}
      className="w-full border glass rounded-lg p-6"
    >
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold text-white distance-bottom-sm">
          {title || `Comments for Version ${versionNumber}`}
        </h2>

        {/* Existing Comments */}
        <div className="w-full distance-bottom-md max-h-60 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-gray-400 text-center">Loading comments...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="border glass rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      {editingCommentId === comment.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(comment.id)}
                            disabled={!editCommentText.trim()}
                            className="w-6 h-6 border glass rounded-full flex items-center justify-center text-sm text-green-300 hover:bg-green-500/10 disabled:opacity-50 transition-colors"
                            title="Save"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="w-6 h-6 border glass rounded-full flex items-center justify-center text-sm text-gray-300 hover:bg-white/10 transition-colors"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(comment)}
                            className="w-6 h-6 border glass rounded-full flex items-center justify-center text-sm text-blue-300 hover:bg-blue-500/10 transition-colors"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id)}
                            disabled={deleting === comment.id}
                            className="w-6 h-6 border glass rounded-full flex items-center justify-center text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                            title="Delete"
                          >
                            {deleting === comment.id ? '…' : 'x'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {editingCommentId === comment.id ? (
                    <textarea
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      rows={3}
                      className="glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40 resize-none"
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm text-white">{comment.content}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center">No comments yet. Add one below.</p>
          )}
        </div>

        {/* Add New Comment */}
        <div className="w-full distance-bottom-md">
          <label className="block text-2xs text-white text-left mb-2">
            Add Comment
          </label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Describe the changes you made..."
            rows={3}
            className="glass w-full px-3 py-2 text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/40 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="w-full flex justify-between gap-4 pt-2">
          <button
            onClick={onCancel}
            className="glass-btn px-4 py-1"
            disabled={submitting}
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!newComment.trim() || submitting}
            className={`
              glass-btn px-4 py-1
              ${!newComment.trim() || submitting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {submitting ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      </div>
    </div>
  );
}
