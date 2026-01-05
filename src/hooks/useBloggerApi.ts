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

        // Fetch posts directly using blog ID
        const response = await fetchBloggerPosts(BLOG_ID, maxResults);

        // Convert to local format
        const convertedPosts = response.items.map(convertBloggerPostToLocalFormat);
        setPosts(convertedPosts);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch blog posts');
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

        // Fetch post directly using blog ID
        const bloggerPost = await fetchBloggerPost(BLOG_ID, postId);

        // Convert to local format
        const convertedPost = convertBloggerPostToLocalFormat(bloggerPost);
        setPost(convertedPost);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch blog post');
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

        // Fetch posts by label directly using blog ID
        const response = await searchBloggerPostsByLabel(BLOG_ID, label, maxResults);

        // Convert to local format
        const convertedPosts = response.items.map(convertBloggerPostToLocalFormat);
        setPosts(convertedPosts);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch blog posts');
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
