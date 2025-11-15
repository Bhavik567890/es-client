import React from 'react';
import { useDispatch } from 'react-redux';
import { setHighlightWord } from '../features/highlight/highlightSlice';
import '../../src/styles/highlight.scss';

interface Props {
  word: string;
  clearSelection: () => void;
}

const FloatingHighlightBtn: React.FC<Props> = ({ word, clearSelection }) => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(setHighlightWord(word));
    clearSelection();
  };
  

  return (
    <div className="floating-highlight floating-btn">
      <button onClick={onClick}>Highlight Word: "{word}"</button>
      <button className="floating-clear" onClick={() => { dispatch(setHighlightWord(null)); }}>
        Clear
      </button>
    </div>
  );
};

export default FloatingHighlightBtn;
