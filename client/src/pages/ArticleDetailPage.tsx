import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchArticle,
  deleteArticle,
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from '../api';
import type { Article, Comment } from '../types';
import { CommentList } from '../components/CommentList';
import { AddCommentForm } from '../components/AddCommentForm';

export const ArticleDetailPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isDeletingArticle, setIsDeletingArticle] = useState(false);

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
      navigate('/');
    } catch (err: any) {
      alert(err?.message || 'Failed to delete article.');
      setIsDeletingArticle(false);
    }
  };

  const handleAddComment = async (body: string) => {
    if (!articleId) return;
    const newComment = await createComment(articleId, { body });
    // Append the new comment without a page reload
    setComments((prev) => [...prev, newComment]);
  };

  const handleUpdateComment = async (commentId: number, body: string) => {
    if (!articleId) return;
    const updated = await updateComment(articleId, commentId, { body });
    // Update the comment in place without a page reload
    setComments((prev) =>
      prev.map((c) => (c.commentId === commentId ? updated : c)),
    );
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!articleId) return;
    await deleteComment(articleId, commentId);
    // Remove the comment from the list without a page reload
    setComments((prev) => prev.filter((c) => c.commentId !== commentId));
  };

  if (isLoadingArticle) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (articleError || !article) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          <h3>Article Not Found</h3>
          <p>{articleError || 'The requested article could not be found.'}</p>
          <div className="mt-4">
            <Link to="/" className="btn btn-secondary">
              &larr; Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container article-detail-page">
      <div className="navigation-back">
        <Link to="/" className="back-link">
          &larr; All Articles
        </Link>
      </div>

      <article className="article-main">
        <div className="article-header">
          <h1 className="article-title">{article.title}</h1>
          <div className="article-actions">
            <Link
              to={`/articles/${article.articleId}/edit`}
              className="btn btn-secondary"
            >
              Edit Article
            </Link>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteArticle}
              disabled={isDeletingArticle}
            >
              {isDeletingArticle ? 'Deleting...' : 'Delete Article'}
            </button>
          </div>
        </div>

        <div className="article-content">
          <p>{article.contents}</p>
        </div>
      </article>

      <section className="comments-section">
        <div className="comments-header">
          <h3 className="comments-title">
            Comments <span className="badge">{comments.length}</span>
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
    </div>
  );
};
