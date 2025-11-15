import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const PostList = lazy(() => import("./page/postlist"));
const PostDetail = lazy(() => import("./page/postdetail"));
const AddEditPost = lazy(() => import("./page/addedit-post"));

import "../src/styles/header.scss";
import Loader from "./components/loader";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <header className="app-header">
        <Link to="/">
          <h1>Blog</h1>
        </Link>
        <Link to="/add">
          <button>Add Post</button>
        </Link>
      </header>

      <main className="container">
        <Suspense fallback={
          <Loader/>
        }>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/add" element={<AddEditPost />} />
            <Route path="/edit/:id" element={<AddEditPost />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right"/>
      </main>
    </BrowserRouter>
  );
};

export default App;
