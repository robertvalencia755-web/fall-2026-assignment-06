import React, { useState } from 'react';
import type { Comment } from '../types';

interface CommentItemProps {
  comment: Comment;
  onUpdate: (commentId: number, body: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStartEdit = () => {
    setEditBody(comment.body);
    setError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditBody(comment.body);
    setError(null);
    setIsEditing(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBody.trim()) {
      setError('Comment cannot be blank.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onUpdate(comment.commentId, editBody.trim());
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to update comment.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    try {
      setIsDeleting(true);
      await onDelete(comment.commentId);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete comment.');
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <li className="comment-item editing">
        <form onSubmit={handleSaveEdit} className="comment-edit-form">
          <label htmlFor={`edit-comment-${comment.commentId}`} className="sr-only">
            Edit Comment
          </label>
          <textarea
            id={`edit-comment-${comment.commentId}`}
            className="input-textarea"
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={3}
            disabled={isSaving}
            autoFocus
          />
          {error && <p className="validation-error">{error}</p>}
          <div className="comment-edit-actions">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="comment-item">
      <div className="comment-body">
        <p>{comment.body}</p>
      </div>
      <div className="comment-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={handleStartEdit}
          disabled={isDeleting}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger-ghost btn-sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </li>
  );
};
