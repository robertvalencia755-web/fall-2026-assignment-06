import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const maxLength = 150;
  const preview =
    article.contents.length > maxLength
      ? `${article.contents.slice(0, maxLength).trim()}...`
      : article.contents;

  // Approximate reading time
  const words = article.contents.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(words / 150));

  return (
    <article className="article-card">
      <div className="article-card-header">
        <div className="article-card-meta">
          <span className="meta-pill">Article #{article.articleId}</span>
          <span className="meta-pill">{readTime} min read</span>
        </div>
        <h2 className="article-card-title">
          <Link to={`/articles/${article.articleId}`}>{article.title}</Link>
        </h2>
      </div>
      <p className="article-card-preview">{preview}</p>
      <div className="article-card-footer">
        <Link
          to={`/articles/${article.articleId}/edit`}
          className="btn btn-ghost btn-sm"
          title="Edit Article"
        >
          ✏️ Edit
        </Link>
        <Link
          to={`/articles/${article.articleId}`}
          className="btn btn-secondary btn-sm"
        >
          Read & Discuss &rarr;
        </Link>
      </div>
    </article>
  );
};
