import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ArticleListPage } from './pages/ArticleListPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { CreateArticlePage } from './pages/CreateArticlePage';
import { EditArticlePage } from './pages/EditArticlePage';
import { NotFoundPage } from './pages/NotFoundPage';
import './App.css';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ArticleListPage />} />
            <Route path="/articles" element={<Navigate to="/" replace />} />
            <Route path="/articles/new" element={<CreateArticlePage />} />
            <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
            <Route path="/articles/:articleId/edit" element={<EditArticlePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
