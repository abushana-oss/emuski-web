'use client'

import { useState, useEffect } from 'react';
import {
  fetchBloggerPosts,
  fetchBloggerPost,
  searchBloggerPostsByLabel,
  convertBloggerPostToLocalFormat,
  BloggerPost
} from '../api/bloggerApi';

// Emuski Feature Blog ID - All manufacturing articles
const BLOG_ID = '3331639473149657933';

export const useBloggerPosts = (maxResults: number = 10) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if API key is available
        if (!process.env.NEXT_PUBLIC_BLOGGER_API_KEY) {
          console.warn('Blogger API key not configured, skipping fetch');
          setPosts([]);
          return;
        }

        // Fetch posts directly using blog ID
        const response = await fetchBloggerPosts(BLOG_ID, maxResults);

        // Convert to local format
        if (response?.items && Array.isArray(response.items)) {
          const convertedPosts = response.items.map(convertBloggerPostToLocalFormat);
          setPosts(convertedPosts);
        } else {
          setPosts([]);
        }
      } catch (err: any) {
        console.error('Error fetching blog posts:', err);
        // Don't show error to user, just log it and show empty state
        setError(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [maxResults]);

  return { posts, loading, error, blogId: BLOG_ID };
};

export const useBloggerPost = (postId: string) => {
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if API key is available
        if (!process.env.NEXT_PUBLIC_BLOGGER_API_KEY) {
          console.warn('Blogger API key not configured, skipping fetch');
          setPost(null);
          return;
        }

        // Fetch post directly using blog ID
        const bloggerPost = await fetchBloggerPost(BLOG_ID, postId);

        // Convert to local format
        const convertedPost = convertBloggerPostToLocalFormat(bloggerPost);
        setPost(convertedPost);
      } catch (err: any) {
        console.error('Error fetching blog post:', err);
        // Don't show error to user, just log it
        setError(null);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return { post, loading, error };
};

export const useBloggerPostsByLabel = (label: string, maxResults: number = 10) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if API key is available
        if (!process.env.NEXT_PUBLIC_BLOGGER_API_KEY) {
          console.warn('Blogger API key not configured, skipping fetch');
          setPosts([]);
          return;
        }

        // Fetch posts by label directly using blog ID
        const response = await searchBloggerPostsByLabel(BLOG_ID, label, maxResults);

        // Convert to local format
        if (response?.items && Array.isArray(response.items)) {
          const convertedPosts = response.items.map(convertBloggerPostToLocalFormat);
          setPosts(convertedPosts);
        } else {
          setPosts([]);
        }
      } catch (err: any) {
        console.error('Error fetching blog posts by label:', err);
        // Don't show error to user, just log it and show empty state
        setError(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (label) {
      fetchPosts();
    }
  }, [label, maxResults]);

  return { posts, loading, error };
};
