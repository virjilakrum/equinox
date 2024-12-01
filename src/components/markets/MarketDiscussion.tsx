import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: '8xj2...',
    content: 'The methodology seems sound, but the sample size might be too small for statistical significance.',
    timestamp: Date.now() - 3600000,
  },
  {
    id: '2',
    author: '9yk3...',
    content: 'Previous work in this area achieved similar results. Worth considering the incremental improvement.',
    timestamp: Date.now() - 7200000,
  },
];

interface MarketDiscussionProps {
  marketId: string;
}

export function MarketDiscussion({ marketId }: MarketDiscussionProps) {
  const [comments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    console.log('Submitting comment:', newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-heading">Discussion</h3>
        <div className="flex items-center space-x-2 text-text-secondary">
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm">{comments.length} comments</span>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-background-primary rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{comment.author}</span>
              <span className="text-sm text-text-secondary">
                {new Date(comment.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-text-primary">{comment.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add to the discussion..."
          className="w-full px-4 py-3 pr-12 bg-background-primary border border-equinox-silver/20 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-equinox-green/50"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 p-2 text-equinox-green hover:bg-equinox-green/10 rounded-lg
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newComment.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}