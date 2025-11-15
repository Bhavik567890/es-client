import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ApiResponse, Post } from "./type";
import { client } from "../../api/client";

interface PostsState {
  items: Post[];
  loading: boolean;
  error?: string;
}

const initialState: PostsState = {
  items: [],
  loading: false,
  error: undefined,
};


const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : "Something went wrong";


export const fetchPosts = createAsyncThunk<Post[], void, { rejectValue: string }>(
  "posts/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await client.get("post");
      return res.data.data as Post[];
    } catch (err) {
      const message = (err as any)?.response?.data?.message ?? getErrorMessage(err);
      return rejectWithValue(message);
    }
  }
);


export const fetchPost = createAsyncThunk<Post, string, { rejectValue: string }>(
  "posts/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await client.get(`post/${id}`);
      return res.data.data as Post;
    } catch (err) {
      const message = (err as any)?.response?.data?.message ?? getErrorMessage(err);
      return rejectWithValue(message);
    }
  }
);


export const createPost = createAsyncThunk<ApiResponse<Post>, Post, { rejectValue: string }>(
  "posts/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await client.post("post", payload);
      return res.data as ApiResponse<Post>;
    } catch (err) {
      const message = (err as any)?.response?.data?.message ?? getErrorMessage(err);
      return rejectWithValue(message);
    }
  }
);


export const updatePost = createAsyncThunk<
  ApiResponse<Post>,
  { id: string; data: Post },
  { rejectValue: string }
>("posts/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await client.put(`post/${id}`, data);
    return res.data as ApiResponse<Post>;
  } catch (err) {
     const message = (err as any)?.response?.data?.message ?? getErrorMessage(err);
      return rejectWithValue(message);
  }
});


export const deletePost = createAsyncThunk<
  ApiResponse<any>,
  string,
  { rejectValue: string }
>("posts/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await client.delete(`post/${id}`);
    return res.data as ApiResponse<any>;
  } catch (err) {
    const message = (err as any)?.response?.data?.message ?? getErrorMessage(err);
      return rejectWithValue(message);
  }
});


const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchPosts.pending, (s) => {
        s.loading = true;
        s.error = undefined;
      })
      .addCase(fetchPosts.fulfilled, (s, action) => {
        s.loading = false;
        s.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload || "Failed to fetch posts";
      })

      .addCase(createPost.fulfilled, (s, action) => {
        const newPost = action.payload.data;
        if (newPost) s.items.unshift(newPost);
      })
      .addCase(createPost.rejected, (s, action) => {
        s.error = action.payload || "Failed to create post";
      })

      .addCase(updatePost.fulfilled, (s, action) => {
        const updated = action.payload.data;
        if (!updated) return;
        s.items = s.items.map((p) => (p._id === updated._id ? updated : p));
      })
      .addCase(updatePost.rejected, (s, action) => {
        s.error = action.payload || "Failed to update post";
      })

      .addCase(deletePost.fulfilled, (s, action) => {
        const id = action.meta.arg;
        s.items = s.items.filter((p) => p._id !== id);
      })
      .addCase(deletePost.rejected, (s, action) => {
        s.error = action.payload || "Failed to delete post";
      });
  },
});

export default postsSlice.reducer;
