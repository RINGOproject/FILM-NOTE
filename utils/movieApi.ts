import { Movie, Review, BlogPost, UserProfile } from '../types/movie';
import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7f106327`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`
};

export class MovieAPI {
  // Get all movies
  static async getAllMovies(): Promise<Movie[]> {
    try {
      console.log('Fetching movies from:', `${API_BASE_URL}/movies`);
      const response = await fetch(`${API_BASE_URL}/movies`, {
        headers
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, response.statusText, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.movies || !Array.isArray(data.movies)) {
        throw new Error('응답 데이터가 올바르지 않습니다.');
      }
      
      return data.movies;
    } catch (error) {
      console.error('Error in getAllMovies:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('알 수 없는 오류가 발생했습니다.');
      }
    }
  }

  // Get movie by ID
  static async getMovieById(id: string): Promise<Movie | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
        headers
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch movie: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.movie;
    } catch (error) {
      console.error('Error fetching movie:', error);
      return null;
    }
  }

  // Search movies
  static async searchMovies(query?: string, genre?: string, platform?: string): Promise<Movie[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (genre && genre !== 'All') params.append('genre', genre);
      if (platform && platform !== 'All') params.append('platform', platform);
      
      const response = await fetch(`${API_BASE_URL}/movies/search?${params.toString()}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to search movies: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.movies;
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  // Add new movie
  static async addMovie(movieData: Omit<Movie, 'id'>): Promise<Movie | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/movies`, {
        method: 'POST',
        headers,
        body: JSON.stringify(movieData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add movie: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.movie;
    } catch (error) {
      console.error('Error adding movie:', error);
      return null;
    }
  }

  // Update movie
  static async updateMovie(id: string, movieData: Partial<Movie>): Promise<Movie | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(movieData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update movie: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.movie;
    } catch (error) {
      console.error('Error updating movie:', error);
      return null;
    }
  }

  // Delete movie
  static async deleteMovie(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete movie: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting movie:', error);
      return false;
    }
  }

  // Get reviews for a movie
  static async getMovieReviews(movieId: string): Promise<Review[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${movieId}/reviews`, {
        headers
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        console.warn(`Failed to fetch reviews (${response.status}):`, errorText);
        return []; // Return empty array instead of throwing
      }
      
      const data = await response.json();
      return data.reviews || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return []; // Always return empty array on error
    }
  }

  // Get blog posts for a movie
  static async getMoviePosts(movieId: string): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${movieId}/posts`, {
        headers
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        console.warn(`Failed to fetch posts (${response.status}):`, errorText);
        return [];
      }
      
      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error('Error fetching movie posts:', error);
      return [];
    }
  }

  // Add review for a movie
  static async addMovieReview(movieId: string, reviewData: Omit<Review, 'id' | 'movieId'>): Promise<Review | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${movieId}/reviews`, {
        method: 'POST',
        headers,
        body: JSON.stringify(reviewData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add review: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.review;
    } catch (error) {
      console.error('Error adding review:', error);
      return null;
    }
  }

  // Blog Posts API

  // Get all blog posts
  static async getAllPosts(): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  // Get posts by user
  static async getUserPosts(userId: string): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user posts: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.posts;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }
  }

  // Add new blog post
  static async addPost(postData: Omit<BlogPost, 'id' | 'date' | 'likes' | 'comments' | 'isLiked'>): Promise<BlogPost | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add post: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.post;
    } catch (error) {
      console.error('Error adding post:', error);
      return null;
    }
  }

  // Update blog post
  static async updatePost(postId: string, postData: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update post: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.post;
    } catch (error) {
      console.error('Error updating post:', error);
      return null;
    }
  }

  // Delete blog post
  static async deletePost(postId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }

  // Like/Unlike post
  static async togglePostLike(postId: string, userId: string, isLiked: boolean): Promise<BlogPost | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId, isLiked })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to toggle post like: ${response.statusText || response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return data.post;
    } catch (error) {
      console.error('Error toggling post like:', error);
      return null;
    }
  }

  // Comments API

  // Get comments for a post
  static async getPostComments(postId: string): Promise<Comment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  // Add comment to post
  static async addComment(postId: string, content: string, authorId: string, author: string, authorAvatar: string, parentId?: string): Promise<Comment | null> {
    try {
      const commentData = {
        content,
        author,
        authorId,
        authorAvatar,
        ...(parentId && { parentId })
      };
      
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(commentData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  }

  // Toggle comment like
  static async toggleCommentLike(commentId: string, userId: string): Promise<Comment | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to toggle comment like: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.comment;
    } catch (error) {
      console.error('Error toggling comment like:', error);
      return null;
    }
  }

  // Delete comment
  static async deleteComment(commentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }

  // Users API

  // Get user by ID
  static async getUser(userId: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  // Update user profile
  static async updateUser(userId: string, userData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  // Follow/Unfollow user
  static async toggleFollow(targetUserId: string, followerId: string, isFollowing: boolean): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${targetUserId}/follow`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ followerId, isFollowing })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to toggle follow: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling follow:', error);
      return false;
    }
  }

  // Follow user
  static async followUser(followerId: string, targetUserId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${targetUserId}/follow`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ followerId, isFollowing: true })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to follow user: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  }

  // Unfollow user
  static async unfollowUser(followerId: string, targetUserId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${targetUserId}/follow`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ followerId, isFollowing: false })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to unfollow user: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  }

  // Get user's followers (returns user IDs)
  static async getUserFollowers(userId: string): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/followers`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch followers: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.followers;
    } catch (error) {
      console.error('Error fetching followers:', error);
      return [];
    }
  }

  // Get user's followers with full user details
  static async getUserFollowersDetails(userId: string): Promise<UserProfile[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/followers/details`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch followers details: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.followers || [];
    } catch (error) {
      console.error('Error fetching followers details:', error);
      return [];
    }
  }

  // Get user's following with full user details
  static async getUserFollowingDetails(userId: string): Promise<UserProfile[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/following/details`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch following details: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.following || [];
    } catch (error) {
      console.error('Error fetching following details:', error);
      return [];
    }
  }

  // Get user's following
  static async getUserFollowing(userId: string): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/following`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch following: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.following;
    } catch (error) {
      console.error('Error fetching following:', error);
      return [];
    }
  }

  // Get all users
  static async getAllUsers(): Promise<UserProfile[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  // Get user by ID (alias for getUser)
  static async getUserById(userId: string): Promise<UserProfile | null> {
    return this.getUser(userId);
  }

  // Authentication API

  // Signup
  static async signup(email: string, password: string, name: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password, name })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }

  // Login
  static async login(email: string, password: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  // Find ID (email) by name and phone
  static async findId(name: string, phone: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/find-id`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, phone })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to find ID');
      }
      
      const data = await response.json();
      return data.email;
    } catch (error) {
      console.error('Error finding ID:', error);
      throw error;
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // Delete user account
  static async deleteUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Update user's watched movies
  static async updateUserWatchedMovies(userId: string, movieIds: string[]): Promise<UserProfile | null> {
    try {
      console.log(`[MovieAPI] Updating watched movies for user ${userId}`, movieIds);
      const response = await fetch(`${API_BASE_URL}/users/${userId}/watched-movies`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ movieIds })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[MovieAPI] Failed to update watched movies:`, response.status, errorText);
        throw new Error(`Failed to update watched movies: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`[MovieAPI] Watched movies updated successfully`);
      return data.user;
    } catch (error) {
      console.error('[MovieAPI] Error updating watched movies:', error);
      return null;
    }
  }

  // Update user's platforms
  static async updateUserPlatforms(userId: string, platforms: string[]): Promise<UserProfile | null> {
    try {
      console.log(`[MovieAPI] Updating platforms for user ${userId}`, platforms);
      const response = await fetch(`${API_BASE_URL}/users/${userId}/platforms`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ platforms })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[MovieAPI] Failed to update platforms:`, response.status, errorText);
        throw new Error(`Failed to update platforms: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`[MovieAPI] Platforms updated successfully`);
      return data.user;
    } catch (error) {
      console.error('[MovieAPI] Error updating platforms:', error);
      return null;
    }
  }

}

// Additional Comment interface for API responses
interface Comment {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  parentId?: string;
}