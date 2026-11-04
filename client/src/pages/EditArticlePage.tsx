import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchArticle, updateArticle } from '../api';

export const EditArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    contents?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!articleId) return;

    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        setApiError(null);
        const article = await fetchArticle(articleId!);
        if (isMounted) {
          setTitle(article.title);
          setContents(article.contents);
        }
      } catch (err: any) {
        if (isMounted) {
          setApiError(err?.message || 'Failed to load article.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [articleId]);

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
    if (!validate() || !articleId) {
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);
      await updateArticle(articleId, {
        title: title.trim(),
        contents: contents.trim(),
      });
      // Redirect to the updated article's detail view
      navigate(`/articles/${articleId}`);
    } catch (err: any) {
      setApiError(err?.message || 'Failed to update article.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading article details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container form-page">
      <div className="navigation-back">
        <Link to={`/articles/${articleId}`} className="back-link">
          &larr; Back to Article
        </Link>
      </div>

      <div className="form-card">
        <h1 className="form-title">Edit Article</h1>
        <p className="form-subtitle">Update your article's title or contents.</p>

        {apiError && (
          <div className="alert alert-error">
            <p>{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="article-form">
          <div className="form-group">
            <label htmlFor="edit-title" className="form-label">
              Article Title <span className="required-star">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              className={`form-input ${validationErrors.title ? 'input-error' : ''}`}
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
            <label htmlFor="edit-contents" className="form-label">
              Article Contents <span className="required-star">*</span>
            </label>
            <textarea
              id="edit-contents"
              className={`form-textarea ${validationErrors.contents ? 'input-error' : ''}`}
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
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <Link to={`/articles/${articleId}`} className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
