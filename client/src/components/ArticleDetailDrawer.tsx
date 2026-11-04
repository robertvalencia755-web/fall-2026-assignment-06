import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  fetchArticle,
  deleteArticle,
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from '../api';
import type { Article, Comment } from '../types';
import { CommentList } from './CommentList';
import { AddCommentForm } from './AddCommentForm';

interface ArticleDetailDrawerProps {
  onArticleDeleted: (articleId: number) => void;
}

export const ArticleDetailDrawer: React.FC<ArticleDetailDrawerProps> = ({
  onArticleDeleted,
}) => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isDeletingArticle, setIsDeletingArticle] = useState(false);

  const closeDrawer = useCallback(() => {
    navigate('/');
  }, [navigate]);

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

  const loadArticle = useCallback(async () => {
    if (!articleId) return;
    try {
      setIsLoadingArticle(true);
      setArticleError(null);
      const data = await fetchArticle(articleId);
      setArticle(data);
    } catch (err: any) {
      setArticleError(err?.message || 'Failed to load article.');
    } finally {
      setIsLoadingArticle(false);
    }
  }, [articleId]);

  const loadComments = useCallback(async () => {
    if (!articleId) return;
    try {
      setIsLoadingComments(true);
      setCommentError(null);
      const data = await fetchComments(articleId);
      setComments(data);
    } catch (err: any) {
      setCommentError(err?.message || 'Failed to load comments.');
    } finally {
      setIsLoadingComments(false);
    }
  }, [articleId]);

  useEffect(() => {
    loadArticle();
    loadComments();
  }, [loadArticle, loadComments]);

  const handleDeleteArticle = async () => {
    if (!article || !articleId) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete "${article.title}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setIsDeletingArticle(true);
      await deleteArticle(articleId);
      onArticleDeleted(article.articleId);
      closeDrawer();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete article.');
      setIsDeletingArticle(false);
    }
  };

  const handleAddComment = async (body: string) => {
    if (!articleId) return;
    const newComment = await createComment(articleId, { body });
    // Append the new comment without a full page reload
    setComments((prev) => [...prev, newComment]);
  };

  const handleUpdateComment = async (commentId: number, body: string) => {
    if (!articleId) return;
    const updated = await updateComment(articleId, commentId, { body });
    // Update the comment in place without a full page reload
    setComments((prev) =>
      prev.map((c) => (c.commentId === commentId ? updated : c)),
    );
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!articleId) return;
    await deleteComment(articleId, commentId);
    // Remove the comment from the list without a full page reload
    setComments((prev) => prev.filter((c) => c.commentId !== commentId));
  };

  return (
    <div className="drawer-backdrop" onClick={closeDrawer}>
      <aside
        className="slide-drawer drawer-detail"
        onClick={(e) => e.stopPropagation()}
        aria-label="Article Reader and Comments"
      >
        <div className="drawer-header">
          <div className="drawer-header-left">
            <span className="drawer-badge">Article Reader</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={closeDrawer}
            aria-label="Close reader drawer"
          >
            &times;
          </button>
        </div>

        <div className="drawer-content">
          {isLoadingArticle && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Opening article...</p>
            </div>
          )}

          {articleError && (
            <div className="alert alert-error">
              <h3>Article Not Found</h3>
              <p>{articleError}</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm mt-4"
                onClick={closeDrawer}
              >
                Close Drawer
              </button>
            </div>
          )}

          {!isLoadingArticle && article && (
            <>
              <article className="drawer-article">
                <div className="drawer-article-header">
                  <h1 className="drawer-article-title">{article.title}</h1>
                  <div className="drawer-article-actions">
                    <Link
                      to={`/articles/${article.articleId}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={handleDeleteArticle}
                      disabled={isDeletingArticle}
                    >
                      {isDeletingArticle ? 'Deleting...' : '🗑️ Delete'}
                    </button>
                  </div>
                </div>

                <div className="drawer-article-body">
                  <p>{article.contents}</p>
                </div>
              </article>

              <hr className="drawer-divider" />

              <section className="drawer-comments-section">
                <div className="comments-header">
                  <h3 className="comments-title">
                    Discussion <span className="badge">{comments.length}</span>
                  </h3>
                </div>

                {commentError && (
                  <div className="alert alert-error">
                    <p>{commentError}</p>
                  </div>
                )}

                <CommentList
                  comments={comments}
                  isLoading={isLoadingComments}
                  onUpdateComment={handleUpdateComment}
                  onDeleteComment={handleDeleteComment}
                />

                <AddCommentForm onAddComment={handleAddComment} />
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
};
