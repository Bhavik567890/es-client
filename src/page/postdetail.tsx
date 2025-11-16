import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { deletePost, fetchPost } from "../features/posts/postslice";
import FloatingHighlightBtn from "../components/floatinghighligh-btn";
import { useAppDispatch } from "../hooks";
import "../../src/styles/post-detail.scss";
import Loader from "../components/loader";
import {  highlightText } from "../utils/util";



const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const post = useSelector((s: RootState) =>
    s.posts.items.find((p) => p._id === id)
  );
  const highlight = useSelector((s: RootState) => s.highlight.word);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) dispatch(fetchPost(id));
  }, [dispatch, id]);

useEffect(() => {
  let shouldIgnore = false;

  const handleMouseDown = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(".floating-btn")) {
      shouldIgnore = true;
    } else {
      shouldIgnore = false;
    }
  };

  const handleMouseUp = () => {
    if (shouldIgnore) return;

    const txt = window.getSelection()?.toString().trim() ?? "";
    if (txt && !/\s/.test(txt)) {
      setSelectedWord(txt);
    } else {
      setSelectedWord(null);
    }
  };

  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mouseup", handleMouseUp);

  return () => {
    document.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mouseup", handleMouseUp);
  };
}, []);



  const onDelete = async () => {
    if (!id) return;
    if (confirm("Delete this post?")) {
      try {
        const res = await dispatch(deletePost(id));

        const message =
          typeof res.payload === "object" &&
          res.payload !== null &&
          "message" in res.payload
            ? (res.payload as { message?: string }).message
            : undefined;
        toast.success(message || "Post deleted");
        navigate("/");
      } catch (error) {
        toast.error(String(error));
      }
    }
  };

  const clearSelection = () => {
    const sel = window.getSelection();
    sel?.removeAllRanges();
    setSelectedWord(null);
  };

  if (!post) return <Loader />;

  console.log(selectedWord,"selectedWord")

  return (
    <div className="page post-detail">

      {selectedWord && (
        <FloatingHighlightBtn
          word={selectedWord}
          clearSelection={clearSelection}
        />
      )}
      <h1>{highlightText(post.title, highlight)}</h1>
      <p className="meta">
        By: {post.author} • {new Date(post.createdAt || "").toLocaleString()}
      </p>
      <div className="body">{highlightText(post.body, highlight)}</div>

      <div className="actions">
        <button onClick={() => navigate(`/edit/${post._id}`)}>Edit</button>
        <button onClick={onDelete} className="danger">
          Delete
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
