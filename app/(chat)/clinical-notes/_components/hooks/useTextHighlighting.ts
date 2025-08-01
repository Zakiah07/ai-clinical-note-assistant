import { useCallback } from 'react';

export const useTextHighlighting = () => {
  const highlightFlaggedWords = useCallback(
    (text: string, flaggedWords: string[]) => {
      if (!flaggedWords || flaggedWords.length === 0) {
        return text;
      }

      let highlightedText = text;
      flaggedWords.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        highlightedText = highlightedText.replace(
          regex,
          `<span class="bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md font-medium text-sm">${word}</span>`,
        );
      });

      return highlightedText;
    },
    [],
  );

  return { highlightFlaggedWords };
};
