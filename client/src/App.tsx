import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ArticleListPage } from './pages/ArticleListPage';
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
            <Route path="/articles/new" element={<ArticleListPage drawer="create" />} />
            <Route path="/articles/:articleId" element={<ArticleListPage drawer="detail" />} />
            <Route path="/articles/:articleId/edit" element={<ArticleListPage drawer="edit" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
