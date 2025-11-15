import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { Post } from '../features/posts/type';
import '../../src/styles/post-card.scss';

interface Props { post: Post; }

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightText = (text: string, word: string | null) => {
  if (!word) return text;
  const re = new RegExp(`\\b(${escapeRegExp(word)})\\b`, 'gi');
  return text.split(re).map((part, i) =>
    re.test(part) ? <mark key={i} className="highlight">{part}</mark> : part
  );
};

const PostCard: React.FC<Props> = ({ post }) => {
  const highlight = useSelector((s: RootState) => s.highlight.word);
  return (
    <div className="post-card">
      <h3>{highlightText(post?.title, highlight)}</h3>
      <p className="meta">By: {post?.author} • {new Date(post?.createdAt || '').toLocaleString()}</p>
      <p>{highlightText(post?.body?.slice(0, 200) + (post?.body?.length>200?'...':''), highlight)}</p>
      <Link to={`/posts/${post?._id}`}>Read more</Link>
    </div>
  );
};

export default PostCard;
