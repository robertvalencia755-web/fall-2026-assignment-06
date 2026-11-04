import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createArticle } from '../api';

export const CreateArticlePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    contents?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errors: { title?: string; contents?: string } = {};
    if (!title.trim()) {
      errors.title = 'Title is required and cannot be blank.';
    }
    if (!contents.trim()) {
      errors.contents = 'Contents are required and cannot be blank.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);
      const newArticle = await createArticle({
        title: title.trim(),
        contents: contents.trim(),
      });
      // Redirect to new article's detail view
      navigate(`/articles/${newArticle.articleId}`);
    } catch (err: any) {
      setApiError(err?.message || 'Failed to create article.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container form-page">
      <div className="navigation-back">
        <Link to="/" className="back-link">
          &larr; Back to Articles
        </Link>
      </div>

      <div className="form-card">
        <h1 className="form-title">Create New Article</h1>
        <p className="form-subtitle">Fill in the details below to publish an article.</p>

        {apiError && (
          <div className="alert alert-error">
            <p>{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="article-form">
          <div className="form-group">
            <label htmlFor="article-title" className="form-label">
              Article Title <span className="required-star">*</span>
            </label>
            <input
              id="article-title"
              type="text"
              className={`form-input ${validationErrors.title ? 'input-error' : ''}`}
              placeholder="e.g., Understanding Single Page Applications"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationErrors.title) {
                  setValidationErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              disabled={isSubmitting}
            />
            {validationErrors.title && (
              <p className="validation-error">{validationErrors.title}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="article-contents" className="form-label">
              Article Contents <span className="required-star">*</span>
            </label>
            <textarea
              id="article-contents"
              className={`form-textarea ${validationErrors.contents ? 'input-error' : ''}`}
              placeholder="Write the full content of your article here..."
              rows={8}
              value={contents}
              onChange={(e) => {
                setContents(e.target.value);
                if (validationErrors.contents) {
                  setValidationErrors((prev) => ({ ...prev, contents: undefined }));
                }
              }}
              disabled={isSubmitting}
            />
            {validationErrors.contents && (
              <p className="validation-error">{validationErrors.contents}</p>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Article'}
            </button>
            <Link to="/" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
