import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchArticle, createArticle, updateArticle } from '../api';
import type { Article } from '../types';

interface ArticleFormDrawerProps {
  mode: 'create' | 'edit';
  onArticleSaved: (article: Article) => void;
}

export const ArticleFormDrawer: React.FC<ArticleFormDrawerProps> = ({
  mode,
  onArticleSaved,
}) => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    contents?: string;
  }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeDrawer = useCallback(() => {
    if (mode === 'edit' && articleId) {
      navigate(`/articles/${articleId}`);
    } else {
      navigate('/');
    }
  }, [navigate, mode, articleId]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeDrawer]);

  // Load article if editing
  useEffect(() => {
    if (mode !== 'edit' || !articleId) return;

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
          setApiError(err?.message || 'Failed to load article details.');
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
  }, [mode, articleId]);

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

      if (mode === 'create') {
        const created = await createArticle({
          title: title.trim(),
          contents: contents.trim(),
        });
        onArticleSaved(created);
        navigate(`/articles/${created.articleId}`);
      } else if (mode === 'edit' && articleId) {
        const updated = await updateArticle(articleId, {
          title: title.trim(),
          contents: contents.trim(),
        });
        onArticleSaved(updated);
        navigate(`/articles/${articleId}`);
      }
    } catch (err: any) {
      setApiError(err?.message || 'Failed to save article.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="drawer-backdrop" onClick={closeDrawer}>
      <aside
        className="slide-drawer drawer-form"
        onClick={(e) => e.stopPropagation()}
        aria-label={mode === 'create' ? 'Create Article' : 'Edit Article'}
      >
        <div className="drawer-header">
          <div className="drawer-header-left">
            <span className="drawer-badge">
              {mode === 'create' ? '✨ New Article' : '✏️ Editor'}
            </span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={closeDrawer}
            aria-label="Close drawer"
          >
            &times;
          </button>
        </div>

        <div className="drawer-content">
          <div className="form-drawer-header">
            <h2 className="form-drawer-title">
              {mode === 'create' ? 'Write a New Article' : 'Edit Article'}
            </h2>
            <p className="form-drawer-subtitle">
              {mode === 'create'
                ? 'Compose your ideas, guides, or discussions.'
                : 'Modify your article details and content.'}
            </p>
          </div>

          {isLoading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading article details...</p>
            </div>
          )}

          {apiError && (
            <div className="alert alert-error">
              <p>{apiError}</p>
            </div>
          )}

          {!isLoading && (
            <form onSubmit={handleSubmit} noValidate className="article-form">
              <div className="form-group">
                <label htmlFor="drawer-article-title" className="form-label">
                  Article Title <span className="required-star">*</span>
                </label>
                <input
                  id="drawer-article-title"
                  type="text"
                  className={`form-input ${validationErrors.title ? 'input-error' : ''}`}
                  placeholder="e.g., Deep Dive into React Single Page Applications"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (validationErrors.title) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        title: undefined,
                      }));
                    }
                  }}
                  disabled={isSubmitting}
                  autoFocus
                />
                {validationErrors.title && (
                  <p className="validation-error">{validationErrors.title}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="drawer-article-contents" className="form-label">
                  Article Contents <span className="required-star">*</span>
                </label>
                <textarea
                  id="drawer-article-contents"
                  className={`form-textarea ${validationErrors.contents ? 'input-error' : ''}`}
                  placeholder="Write the full content of your article here..."
                  rows={12}
                  value={contents}
                  onChange={(e) => {
                    setContents(e.target.value);
                    if (validationErrors.contents) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        contents: undefined,
                      }));
                    }
                  }}
                  disabled={isSubmitting}
                />
                {validationErrors.contents && (
                  <p className="validation-error">{validationErrors.contents}</p>
                )}
              </div>

              <div className="drawer-form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Saving...'
                    : mode === 'create'
                      ? 'Publish Article'
                      : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={closeDrawer}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
};
