import { useState, useCallback } from 'react';

export function useNews(initialNews: string[] = []) {
  const [news, setNews] = useState<string[]>(initialNews);

  const addNews = useCallback((headline: string) => {
    setNews(prev => [...prev, headline].slice(-10)); // Keep last 10 headlines
  }, []);

  const setNewsDirectly = useCallback((newNews: string[]) => {
    setNews(newNews);
  }, []);

  return {
    news,
    addNews,
    setNewsDirectly
  };
}
