import React, { useState } from 'react';

interface AddCommentFormProps {
  onAddComment: (body: string) => Promise<void>;
}

export const AddCommentForm: React.FC<AddCommentFormProps> = ({
  onAddComment,
}) => {
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      setError('Comment body cannot be blank.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onAddComment(body.trim());
      setBody('');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-comment-form">
      <h4 className="add-comment-title">Add a Comment</h4>
      <div className="form-group">
        <label htmlFor="new-comment-body" className="sr-only">
          Write a comment
        </label>
        <textarea
          id="new-comment-body"
          className="input-textarea"
          placeholder="Share your thoughts..."
          rows={3}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            if (error && e.target.value.trim()) {
              setError(null);
            }
          }}
          disabled={isSubmitting}
        />
        {error && <p className="validation-error">{error}</p>}
      </div>
      <div className="add-comment-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};
