import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📝</span>
          <span className="brand-title">DevArticles</span>
        </Link>
        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            All Articles
          </NavLink>
          <NavLink
            to="/articles/new"
            className={({ isActive }) =>
              isActive ? 'nav-link active create-link' : 'nav-link create-link'
            }
          >
            + Create Article
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
