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

        // Fetch posts using secure API route
        const response = await fetch(`/api/blog?blogId=${BLOG_ID}&maxResults=${maxResults}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        
        const data = await response.json();

        // Convert to local format
        if (data?.items && Array.isArray(data.items)) {
          const convertedPosts = data.items.map(convertBloggerPostToLocalFormat);
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

        // Fetch single post using secure API route
        const response = await fetch(`/api/blog/${postId}?blogId=${BLOG_ID}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        
        const bloggerPost = await response.json();

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

        // Fetch posts by label using secure API route
        const response = await fetch(`/api/blog?blogId=${BLOG_ID}&maxResults=${maxResults}&label=${encodeURIComponent(label)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts by label');
        }
        
        const data = await response.json();

        // Convert to local format
        if (data?.items && Array.isArray(data.items)) {
          const convertedPosts = data.items.map(convertBloggerPostToLocalFormat);
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
