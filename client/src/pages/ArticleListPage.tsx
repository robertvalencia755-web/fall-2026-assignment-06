import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchArticles } from '../api';
import type { Article } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { ArticleDetailDrawer } from '../components/ArticleDetailDrawer';
import { ArticleFormDrawer } from '../components/ArticleFormDrawer';

interface ArticleListPageProps {
  drawer?: 'detail' | 'create' | 'edit';
}

export const ArticleListPage: React.FC<ArticleListPageProps> = ({ drawer }) => {
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

  const handleArticleDeleted = (deletedId: number) => {
    setArticles((prev) => prev.filter((a) => a.articleId !== deletedId));
  };

  const handleArticleSaved = (savedArticle: Article) => {
    setArticles((prev) => {
      const exists = prev.some((a) => a.articleId === savedArticle.articleId);
      if (exists) {
        return prev.map((a) =>
          a.articleId === savedArticle.articleId ? savedArticle : a,
        );
      }
      return [savedArticle, ...prev];
    });
  };

  return (
    <div className="page-container article-list-page">
      {/* Hero Feed Banner */}
      <div className="feed-banner">
        <div className="feed-banner-content">
          <div className="feed-badge">Knowledge Base & Articles</div>
          <h1 className="feed-title">Developer Insights & Discussions</h1>
          <p className="feed-subtitle">
            Explore articles, write new insights, and join discussions in real time.
          </p>
        </div>
        <Link to="/articles/new" className="btn btn-primary create-article-btn">
          ✨ + New Article
        </Link>
      </div>

      {/* Search & Filter Bar */}
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

      {/* Feed Status States */}
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
              : 'There are no articles in the database yet.'}
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
              Write the First Article
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

      {/* Slide-over Drawers */}
      {drawer === 'detail' && (
        <ArticleDetailDrawer onArticleDeleted={handleArticleDeleted} />
      )}

      {drawer === 'create' && (
        <ArticleFormDrawer mode="create" onArticleSaved={handleArticleSaved} />
      )}

      {drawer === 'edit' && (
        <ArticleFormDrawer mode="edit" onArticleSaved={handleArticleSaved} />
      )}
    </div>
  );
};
