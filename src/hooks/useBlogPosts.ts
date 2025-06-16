"use client";

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { languageAtom } from '@/atoms/language';
import type { BlogPost } from '@/app/utils/blog';

export function useBlogPosts(initialPosts: BlogPost[] = []) {
  const [language] = useAtom(languageAtom);
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (initialPosts.length === 0) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/blog-posts?language=${language}`);
        if (response.ok) {
          const newPosts = await response.json();
          setPosts(newPosts);
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        // Fallback to initial posts
        setPosts(initialPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [language, initialPosts]);

  return { posts, loading };
} 