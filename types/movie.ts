export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  description: string;
  genre: string | string[]; // 단일 장르 또는 여러 장르 지원
  year: number;
  duration: number; // 기존 속성 유지
  runtime?: number; // 새 속성은 optional
  rating: number;
  reviewCount?: number;
  poster: string;
  director?: string;
  cast?: string[];
  platform: string;
}

export interface Review {
  id: string;
  movieId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  isMyReview?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  bio?: string;
  verified?: 'popcorn' | 'glasses' | 'pro' | false;
  verificationLevel?: 'popcorn' | 'glasses' | 'pro' | false;
  followersCount: number;
  followingCount: number;
  watchedMovies: string[]; // Array of movie IDs - 이 배열로 모든 통계 자동 계산
  stats: {
    totalReviews: number;
    averageRating: number;
    totalMoviesWatched?: number;
    watchedMovies: number;
    platforms: string[];
    followers?: number;
    following?: number;
    averageRating?: number;
    // moviesThisYear와 genreStats는 watchedMovies에서 자동 계산됨
  };
}

export interface BlogPost {
  id: string;
  movieId: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  rating: number;
  date: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked?: boolean;
  summary?: string;
  pros?: string[];
  cons?: string[];
  recommendation?: 'highly_recommended' | 'recommended' | 'neutral' | 'not_recommended';
  spoilerFree?: boolean;
  spoiler?: boolean;
  movieTitle?: string;
  moviePoster?: string;
  platform?: string;
}

export interface FollowRelation {
  followerId: string;
  followingId: string;
  date: string;
}

export interface FeedPost extends BlogPost {
  isFollowing: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  likedBy: string[];
  replies?: Comment[];
  parentId?: string;
}