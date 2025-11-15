import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface HighlightState {
  word: string | null;
}

const initialState: HighlightState = { word: null };

const highlightSlice = createSlice({
  name: 'highlight',
  initialState,
  reducers: {
    setHighlightWord(state, action: PayloadAction<string | null>) {
      state.word = action.payload;
    }
  }
});

export const { setHighlightWord } = highlightSlice.actions;
export default highlightSlice.reducer;
