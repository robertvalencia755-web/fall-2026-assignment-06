import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="page-container not-found-page">
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          Back to Articles
        </Link>
      </div>
    </div>
  );
};
