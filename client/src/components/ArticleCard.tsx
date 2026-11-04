import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const maxLength = 140;
  const preview =
    article.contents.length > maxLength
      ? `${article.contents.slice(0, maxLength).trim()}...`
      : article.contents;

  return (
    <article className="article-card">
      <div className="article-card-header">
        <h2 className="article-card-title">
          <Link to={`/articles/${article.articleId}`}>{article.title}</Link>
        </h2>
      </div>
      <p className="article-card-preview">{preview}</p>
      <div className="article-card-footer">
        <Link
          to={`/articles/${article.articleId}`}
          className="btn btn-secondary btn-sm"
        >
          Read More &rarr;
        </Link>
      </div>
    </article>
  );
};
