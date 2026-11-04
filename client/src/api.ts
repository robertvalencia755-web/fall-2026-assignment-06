import type {
  Article,
  Comment,
  CreateArticleInput,
  UpdateArticleInput,
  CreateCommentInput,
  UpdateCommentInput,
} from './types';

const API_BASE_URL = 'http://localhost:8080';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `HTTP error ${res.status}: ${res.statusText}`;
    try {
      const data = await res.json();
      if (data && data.error) {
        errorMessage = data.error;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}

export async function fetchArticles(titleContains?: string): Promise<Article[]> {
  const url = new URL(`${API_BASE_URL}/articles`);
  if (titleContains && titleContains.trim().length > 0) {
    url.searchParams.set('title_contains', titleContains.trim());
  }
  const res = await fetch(url.toString());
  return handleResponse<Article[]>(res);
}

export async function fetchArticle(articleId: number | string): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles/${articleId}`);
  return handleResponse<Article>(res);
}

export async function createArticle(input: CreateArticleInput): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Article>(res);
}

export async function updateArticle(
  articleId: number | string,
  input: UpdateArticleInput,
): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Article>(res);
}

export async function deleteArticle(articleId: number | string): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
    method: 'DELETE',
  });
  return handleResponse<Article>(res);
}

export async function fetchComments(articleId: number | string): Promise<Comment[]> {
  const res = await fetch(`${API_BASE_URL}/articles/${articleId}/comments`);
  return handleResponse<Comment[]>(res);
}

export async function createComment(
  articleId: number | string,
  input: CreateCommentInput,
): Promise<Comment> {
  const res = await fetch(`${API_BASE_URL}/articles/${articleId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Comment>(res);
}

export async function updateComment(
  articleId: number | string,
  commentId: number | string,
  input: UpdateCommentInput,
): Promise<Comment> {
  const res = await fetch(
    `${API_BASE_URL}/articles/${articleId}/comments/${commentId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  );
  return handleResponse<Comment>(res);
}

export async function deleteComment(
  articleId: number | string,
  commentId: number | string,
): Promise<Comment> {
  const res = await fetch(
    `${API_BASE_URL}/articles/${articleId}/comments/${commentId}`,
    {
      method: 'DELETE',
    },
  );
  return handleResponse<Comment>(res);
}
