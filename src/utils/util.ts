import React from 'react';

export const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const highlightText = (text: string, word: string | null) => {
  if (!word) return text;
  const re = new RegExp(`\\b(${escapeRegExp(word)})\\b`, 'gi');
  return text.split(re).map((part, i) =>
    re.test(part) ? React.createElement('mark', { key: i, className: 'highlight' }, part) : part
  );
};