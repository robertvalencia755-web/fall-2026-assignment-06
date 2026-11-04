import React from 'react';
import type { Comment } from '../types';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  onUpdateComment: (commentId: number, body: string) => Promise<void>;
  onDeleteComment: (commentId: number) => Promise<void>;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  isLoading,
  onUpdateComment,
  onDeleteComment,
}) => {
  if (isLoading) {
    return <div className="loading-spinner">Loading comments...</div>;
  }

  if (comments.length === 0) {
    return (
      <div className="empty-state empty-comments">
        <p>No comments yet.</p>
      </div>
    );
  }

  return (
    <ul className="comments-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          onUpdate={onUpdateComment}
          onDelete={onDeleteComment}
        />
      ))}
    </ul>
  );
};
