export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface ArticleProfile {
  bio?: string;
  avatar?: string;
  socialLinks?: SocialLinks;
  isComplete?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  year?: number;
  college?: string;
  articleProfile?: ArticleProfile;
  followers?: string[];
  following?: string[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    profilePic?: string;
  };
  text: string;
  createdAt: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  coverImage?: string;
  author: {
    _id: string;
    name: string;
    profilePic?: string;
    articleProfile?: ArticleProfile;
  };
  tags?: string[];
  likes?: string[];
  comments?: Comment[];
  seoTitle?: string;
  seoDescription?: string;
  status: "draft" | "published";
  views?: number;
  readTime?: number;
  createdAt: string;
  updatedAt: string;
}
