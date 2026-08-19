export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  fullContent: string;
  category: string;
  author: string;
  authorBio: string;
  authorImage: string;
  publishDate: string;
  lastModified?: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface BlogPostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
}

export interface BlogListResponse {
  data: BlogPostSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface BlogPostResponse {
  data: BlogPost;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApiError {
  error: {
    message: string;
    code: string;
    details?: any;
  };
}

export interface RelatedPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  link: string;
}

// Strapi specific types
export interface StrapiResponse<T> {
  data: T;
  meta: any;
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiArticle {
  id: number;
  attributes: {
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    fullContent?: string;
    featured?: boolean;
    seoTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    category?: {
      data?: {
        id: number;
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    author?: {
      data?: {
        id: number;
        attributes: {
          name: string;
          email?: string;
          bio?: string;
          avatar?: {
            data?: {
              attributes: {
                url: string;
                name: string;
              };
            };
          };
        };
      };
    };
    featuredImage?: {
      data?: {
        attributes: {
          url: string;
          name: string;
          alternativeText?: string;
        };
      };
    };
    tags?: {
      data: {
        id: number;
        attributes: {
          name: string;
          slug: string;
        };
      }[];
    };
  };
}