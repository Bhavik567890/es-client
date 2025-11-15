import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../src/features/posts/postslice';
import highlightReducer from '../src/features/highlight/highlightSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    highlight: highlightReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
