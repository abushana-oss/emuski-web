'use client'

import { useState, useEffect } from 'react';
import {
  fetchBloggerPosts,
  convertBloggerPostToLocalFormat,
} from '../api/bloggerApi';

// Success Stories Blogger blog ID from environment
const SUCCESS_STORIES_BLOG_ID = process.env.NEXT_PUBLIC_SUCCESS_STORIES_BLOG_ID || '850833685312209325';

export const useSuccessStoriesPosts = (maxResults: number = 10) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if blog ID is available
        if (!SUCCESS_STORIES_BLOG_ID) {
          console.warn('Success Stories blog ID not configured, skipping fetch');
          setPosts([]);
          return;
        }

        // Check if API key is available
        if (!process.env.NEXT_PUBLIC_BLOGGER_API_KEY) {
          console.warn('Blogger API key not configured, skipping fetch');
          setPosts([]);
          return;
        }

        // Fetch posts directly using blog ID
        const response = await fetchBloggerPosts(SUCCESS_STORIES_BLOG_ID, maxResults);

        // Convert to local format and set category to "Success Story"
        if (response?.items && Array.isArray(response.items)) {
          const convertedPosts = response.items.map(post => {
            const converted = convertBloggerPostToLocalFormat(post);
            return {
              ...converted,
              category: 'Success Story'
            };
          });
          setPosts(convertedPosts);
        } else {
          setPosts([]);
        }
      } catch (err: any) {
        console.error('Error fetching success stories:', err);
        // Don't show error to user, just log it and show empty state
        setError(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [maxResults]);

  return { posts, loading, error };
};
