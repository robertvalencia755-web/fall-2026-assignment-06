export interface Article {
  articleId: number;
  title: string;
  contents: string;
}

export interface Comment {
  commentId: number;
  articleId: number;
  body: string;
}

export interface CreateArticleInput {
  title: string;
  contents: string;
}

export interface UpdateArticleInput {
  title?: string;
  contents?: string;
}

export interface CreateCommentInput {
  body: string;
}

export interface UpdateCommentInput {
  body: string;
}
