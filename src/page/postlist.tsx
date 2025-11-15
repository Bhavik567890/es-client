import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchPosts } from '../features/posts/postslice';
import type { RootState } from '../store';
import FloatingHighlightBtn from '../components/floatinghighligh-btn';
import PostCard from '../components/postcard';
import { useAppDispatch } from '../hooks';
import '../../src/styles/post-list.scss';
import Loader from '../components/loader';
const PostList: React.FC = () => {
  const dispatch = useAppDispatch();
  const posts = useSelector((s: RootState) => s.posts.items);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const loading = useSelector((s: RootState) => s.posts.loading);


  useEffect(() => { dispatch(fetchPosts()); }, [dispatch]);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      const sel = window.getSelection();
      if (!sel) return;
      const txt = sel.toString().trim();
      if (txt && !/\s/.test(txt) && /^[\p{L}\p{N}'-]+$/u.test(txt)) {
        setSelectedWord(txt);
      } else {
        setSelectedWord(null);
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const clearSelection = () => {
    const sel = window.getSelection();
    sel?.removeAllRanges();
    setSelectedWord(null);
  };

if (loading) return <Loader />;


  return (
    <div className="page post-list">
      <div className="page-header">
        <h1>All Posts</h1>
      </div>
      {selectedWord && <FloatingHighlightBtn word={selectedWord} clearSelection={clearSelection} />}
      <div className="posts-grid">
        {posts.map(p => <PostCard key={p._id} post={p} />)}
      </div>
    </div>
  );
};

export default PostList;
