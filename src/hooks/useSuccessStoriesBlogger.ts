'use client'

import { useState, useEffect } from 'react';
import {
  fetchBloggerPosts,
  convertBloggerPostToLocalFormat,
} from '../api/bloggerApi';

// Success Stories Blogger blog ID
const SUCCESS_STORIES_BLOG_ID = '850833685312209325';

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

        // Fetch posts using secure API route
        const response = await fetch(`/api/blog?blogId=${SUCCESS_STORIES_BLOG_ID}&maxResults=${maxResults}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch success stories');
        }
        
        const data = await response.json();

        // Convert to local format and set category to "Success Story"
        if (data?.items && Array.isArray(data.items)) {
          const convertedPosts = data.items.map(post => {
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
