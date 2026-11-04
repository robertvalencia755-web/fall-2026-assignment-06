import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchArticles } from '../api';
import type { Article } from '../types';
import { ArticleCard } from '../components/ArticleCard';

export const ArticleListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('search') || '';

  const [articles, setArticles] = useState<Article[]>([]);
  const [searchInput, setSearchInput] = useState(queryParam);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchArticles(query);
      setArticles(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load articles.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch articles on mount and whenever the URL search param changes
  useEffect(() => {
    setSearchInput(queryParam);
    loadArticles(queryParam);
  }, [queryParam, loadArticles]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ search: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="page-container article-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Articles</h1>
          <p className="page-subtitle">
            Explore thoughts, guides, and engineering discussions.
          </p>
        </div>
        <Link to="/articles/new" className="btn btn-primary create-article-btn">
          + Create Article
        </Link>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search articles by title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search articles by title"
            />
            {searchInput && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search input"
              >
                &times;
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading articles...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => loadArticles(queryParam)}
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && articles.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No articles found</h3>
          <p>
            {queryParam
              ? `No articles matched your search for "${queryParam}".`
              : 'There are no articles yet. Be the first to create one!'}
          </p>
          {queryParam ? (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleClearSearch}
            >
              Clear Search
            </button>
          ) : (
            <Link to="/articles/new" className="btn btn-primary">
              Create an Article
            </Link>
          )}
        </div>
      )}

      {!isLoading && !error && articles.length > 0 && (
        <div className="articles-grid">
          {articles.map((article) => (
            <ArticleCard key={article.articleId} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};
