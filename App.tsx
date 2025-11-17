import { useState, useMemo, useCallback, useEffect } from 'react';
import { Movie, BlogPost, UserProfile, Comment } from './types/movie';
import { MovieAPI } from './utils/movieApi';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { FindIdPage } from './components/FindIdPage';
import { MovieCard } from './components/MovieCard';
import { MovieModal } from './components/MovieModal';
import { FilterTabs } from './components/FilterTabs';
import { BottomNavigation } from './components/BottomNavigation';
import { ProfilePage } from './components/ProfilePage';
import { OtherUserProfilePage } from './components/OtherUserProfilePage';
import { EnhancedWriteReviewModal } from './components/EnhancedWriteReviewModal';
import { FeedPage } from './components/FeedPage';
import { SearchPage } from './components/SearchPage';
import { MovieCardSkeleton } from './components/MovieCardSkeleton';
import { HomeEmptyState } from './components/HomeEmptyState';
import { HomeErrorState } from './components/HomeErrorState';
import { SettingsPage } from './components/SettingsPage';
import { PWAInstallPrompt, IOSInstallPrompt } from './components/PWAInstallPrompt';
import { PWAHead } from './components/PWAHead';
import { registerServiceWorker } from './utils/pwaInstall';
import { initializeCapacitor, isNativePlatform, getPlatform, triggerHaptic, shareContent } from './utils/capacitorInit';
import { Badge } from './components/ui/badge';
import { Film, TrendingUp, Award, Popcorn, Sparkles, Flame, Star as StarIcon, Clapperboard, Sun, Moon } from 'lucide-react';
import { Button } from './components/ui/button';

export default function App() {
  // Authentication state
  const [authPage, setAuthPage] = useState<'login' | 'signup' | 'forgotPassword' | 'findId'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<UserProfile | null>(null);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'feed' | 'write' | 'profile' | 'otherProfile' | 'settings'>('home');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [preSelectedMovieId, setPreSelectedMovieId] = useState<string | undefined>(undefined);
  const [userBlogPosts, setUserBlogPosts] = useState<BlogPost[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [currentUserData, setCurrentUserData] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  // 포스트별 댓글 저장 (포스트 ID를 키로 사용)
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  
  // 영화 데이터베이스 상태
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for saved session on mount
  useEffect(() => {
    const loadSavedSession = async () => {
      const savedUser = localStorage.getItem('filmNoteUser');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          
          // 데이터베이스에서 최신 사용자 정보 가져오기
          const latestUser = await MovieAPI.getUserById(user.id);
          if (latestUser) {
            setAuthenticatedUser(latestUser);
            setCurrentUserData(latestUser);
            setIsAuthenticated(true);
          } else {
            // DB에 없으면 저장된 데이터 사용
            setAuthenticatedUser(user);
            setCurrentUserData(user);
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error('Error loading saved user:', err);
          localStorage.removeItem('filmNoteUser');
        }
      }
    };
    
    loadSavedSession();
  }, []);

  // Capacitor 및 PWA 초기화
  useEffect(() => {
    const initializePlatform = async () => {
      const platform = getPlatform();
      const isNative = isNativePlatform();

      console.log('🎬 FILM NOTE 초기화');
      console.log('📱 플랫폼:', platform);
      console.log('🔧 네이티브 앱:', isNative);

      if (isNative) {
        // Capacitor 네이티브 앱 초기화
        console.log('📱 Capacitor 네이티브 앱으로 실행 중...');
        await initializeCapacitor();
      } else {
        // PWA 초기화 (웹 브라우저)
        console.log('🌐 PWA 웹 앱으로 실행 중...');
        await registerServiceWorker();
      }

      console.log('✅ 플랫폼 초기화 완료!');
    };

    initializePlatform();
  }, []);

  // Authentication handlers
  const handleLogin = async (email: string, password: string) => {
    const user = await MovieAPI.login(email, password);
    setAuthenticatedUser(user);
    setCurrentUserData(user);
    setIsAuthenticated(true);
    localStorage.setItem('filmNoteUser', JSON.stringify(user));
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    const user = await MovieAPI.signup(email, password, name);
    setAuthenticatedUser(user);
    setCurrentUserData(user);
    setIsAuthenticated(true);
    localStorage.setItem('filmNoteUser', JSON.stringify(user));
  };

  const handleFindId = async (name: string, phone: string): Promise<string> => {
    return await MovieAPI.findId(name, phone);
  };

  const handleResetPassword = async (email: string) => {
    await MovieAPI.resetPassword(email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthenticatedUser(null);
    setCurrentUserData(null);
    localStorage.removeItem('filmNoteUser');
    setActiveTab('home');
  };

  // 영화 데이터 및 블로그 포스트 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 먼저 서버 헬스 체크
        console.log('Checking server health...');
        try {
          const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f106327/health`, {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          });
          
          if (!healthResponse.ok) {
            throw new Error(`서버 연결 실패: ${healthResponse.status} ${healthResponse.statusText}`);
          }
          
          console.log('Server health check passed');
        } catch (healthError) {
          console.error('Server health check failed:', healthError);
          throw new Error(`서버에 연결할 수 없습니다: ${healthError instanceof Error ? healthError.message : '알 수 없는 오류'}`);
        }
        
        // 영화 데이터 로드
        console.log('Loading movies from API...');
        const moviesData = await MovieAPI.getAllMovies();
        console.log('Movies loaded:', moviesData.length);
        
        if (!moviesData || moviesData.length === 0) {
          throw new Error('영화 데이터가 없습니다.');
        }
        
        // 각 영화의 실제 피드 리뷰 개수 로드 및 평점 계산 (실시간 DB 연동)
        console.log('🎬 Loading movie reviews from database (BlogPost feed data)...');
        const updatedMovies = await Promise.all(
          moviesData.map(async (movie) => {
            try {
              // 피드에 작성된 실제 리뷰 데이터(BlogPost) 가져오기
              const posts = await MovieAPI.getMoviePosts(movie.id);
              const reviewCount = posts.length;
              
              // 리뷰가 있으면 실제 피드 리뷰들의 평균 평점 계산
              let rating = 0; // 리뷰가 없으면 0
              
              if (reviewCount > 0) {
                const totalRating = posts.reduce((sum, post) => sum + post.rating, 0);
                rating = totalRating / reviewCount;
                console.log(`  ⭐ Movie "${movie.title}" (ID:${movie.id}): ${reviewCount} reviews → avg ${rating.toFixed(2)}★`);
              } else {
                console.log(`  ⚪ Movie "${movie.title}" (ID:${movie.id}): No reviews in DB`);
              }
              
              return {
                ...movie,
                reviewCount,
                rating
              };
            } catch (error) {
              console.error(`  ❌ Error loading reviews for movie ${movie.id}:`, error);
              // 오류 시 리뷰 없음으로 처리
              return {
                ...movie,
                reviewCount: 0,
                rating: 0
              };
            }
          })
        );
        
        const moviesWithReviews = updatedMovies.filter(m => m.reviewCount && m.reviewCount > 0).length;
        console.log(`✅ Review loading complete: ${moviesWithReviews}/${updatedMovies.length} movies have reviews`);
        
        setMovies(updatedMovies);

        // 블로그 포스트 로드
        console.log('Loading blog posts from API...');
        setPostsLoading(true);
        try {
          const postsData = await MovieAPI.getAllPosts();
          console.log('Posts loaded:', postsData.length);
          setAllBlogPosts(postsData);
          
          // 각 포스트의 댓글 로드
          console.log('Loading comments for all posts...');
          const commentsData: Record<string, Comment[]> = {};
          for (const post of postsData) {
            try {
              const comments = await MovieAPI.getPostComments(post.id);
              if (comments.length > 0) {
                commentsData[post.id] = comments;
                console.log(`  ✅ Post "${post.title}": ${comments.length} comments loaded`);
              }
            } catch (commentError) {
              console.error(`Error loading comments for post ${post.id}:`, commentError);
              commentsData[post.id] = [];
            }
          }
          setPostComments(commentsData);
          console.log(`✅ Comments loaded for ${Object.keys(commentsData).length} posts`);
        } catch (postError) {
          console.error('Error loading posts:', postError);
          // 포스트 로딩 실패는 치명적이지 않으므로 계속 진행
          setAllBlogPosts([]);
          setPostComments({});
        } finally {
          setPostsLoading(false);
        }

        // 모든 사용자 로드
        console.log('Loading all users from API...');
        try {
          const usersData = await MovieAPI.getAllUsers();
          console.log('Users loaded:', usersData.length);
          setAllUsers(usersData);
        } catch (userError) {
          console.error('Error loading users:', userError);
          setAllUsers([]);
        }

        // 현재 사용자의 팔로잉 목록 로드
        if (isAuthenticated && authenticatedUser) {
          console.log('Loading following list for user:', authenticatedUser.id);
          try {
            const followingList = await MovieAPI.getUserFollowing(authenticatedUser.id);
            console.log('Following loaded:', followingList.length);
            setFollowingIds(followingList);
          } catch (followError) {
            console.error('Error loading following:', followError);
            setFollowingIds([]);
          }

          // 현재 사용자의 블로그 포스트 로드
          console.log('Loading user blog posts for user:', authenticatedUser.id);
          try {
            const userPosts = await MovieAPI.getUserPosts(authenticatedUser.id);
            console.log('User posts loaded:', userPosts.length);
            setUserBlogPosts(userPosts);
          } catch (postError) {
            console.error('Error loading user posts:', postError);
            setUserBlogPosts([]);
          }
        }

      } catch (err) {
        console.error('Error loading data:', err);
        setError(`데이터를 불러오는데 실패했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, authenticatedUser]);

  // 데이터베이스에서 블로그 포스트 로드 상태
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // 모든 포스트를 메모이제이션으로 관리 (데이터베이스 데이터만 사용)
  const allPosts = useMemo(() => {
    if (!currentUserData) return allBlogPosts;
    
    // 현재 사용자의 포스트와 다른 사용자의 포스트 결합 (중복 제거)
    const postMap = new Map<string, BlogPost>();
    
    // 먼저 사용자의 포스트 추가
    userBlogPosts.forEach(post => postMap.set(post.id, post));
    
    // DB 포스트 추가 (중복 제거)
    allBlogPosts.forEach(post => {
      if (!postMap.has(post.id)) {
        postMap.set(post.id, post);
      }
    });
    
    return Array.from(postMap.values());
  }, [userBlogPosts, allBlogPosts, currentUserData]);

  // 필터링된 영화 목록 (서버에서 검색하도록 수정)
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  // 영화 검색 및 필터링
  useEffect(() => {
    const searchMovies = async () => {
      try {
        const results = await MovieAPI.searchMovies(
          searchQuery || undefined,
          selectedGenre !== 'All' ? selectedGenre : undefined,
          selectedPlatform !== 'All' ? selectedPlatform : undefined
        );
        setFilteredMovies(results);
      } catch (err) {
        console.error('Error searching movies:', err);
        // 에러 발생 시 로컬 데이터로 폴백
        const fallbackResults = movies.filter(movie => {
          const matchesSearch = !searchQuery || 
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
          const matchesPlatform = selectedPlatform === 'All' || movie.platform === selectedPlatform;
          
          return matchesSearch && matchesGenre && matchesPlatform;
        });
        setFilteredMovies(fallbackResults);
      }
    };

    if (movies.length > 0) {
      searchMovies();
    } else {
      setFilteredMovies([]);
    }
  }, [searchQuery, selectedGenre, selectedPlatform, movies]);

  // 장르 및 플랫폼별 개수 계산
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = { All: movies.length };
    movies.forEach(movie => {
      counts[movie.genre] = (counts[movie.genre] || 0) + 1;
    });
    return counts;
  }, [movies]);

  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = { All: movies.length };
    movies.forEach(movie => {
      counts[movie.platform] = (counts[movie.platform] || 0) + 1;
    });
    return counts;
  }, [movies]);

  // 인기 영화 (평점 4.0 이상) - 메모이제이션
  const popularMovies = useMemo(() => 
    movies.filter(movie => movie.rating >= 4.0), [movies]
  );
  
  // 최신 영화 (2025년) - 메모이제이션
  const recentMovies = useMemo(() => 
    movies.filter(movie => movie.year === 2025), [movies]
  );

  // 🔥 오늘의 추천작 (평점 4.5 이상, 랜덤 4개)
  const todaysPicks = useMemo(() => {
    const highRated = movies.filter(movie => movie.rating >= 4.5);
    return highRated.sort(() => Math.random() - 0.5).slice(0, 4);
  }, [movies]);

  // ⭐ 평점 높은 영화 (연도별 상위 5편)
  const topRatedByYear = useMemo(() => {
    const moviesByYear = movies.reduce((acc, movie) => {
      if (!acc[movie.year]) acc[movie.year] = [];
      acc[movie.year].push(movie);
      return acc;
    }, {} as Record<number, Movie[]>);

    return Object.entries(moviesByYear)
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
      .slice(0, 1) // 최근 1개 연도만
      .flatMap(([year, yearMovies]) =>
        yearMovies.sort((a, b) => b.rating - a.rating).slice(0, 5)
      );
  }, [movies]);

  // 🎬 최신 등록 영화 (올해 개봉작)
  const latestMovies = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return movies
      .filter(movie => movie.year === currentYear)
      .sort((a, b) => b.year - a.year)
      .slice(0, 4);
  }, [movies]);

  // 다크모드 상태
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 탭 변경 핸들러
  const handleTabChange = (tab: 'home' | 'search' | 'feed' | 'write' | 'profile') => {
    if (tab === 'write') {
      setEditingPost(null);
      setWriteModalOpen(true);
    } else {
      setActiveTab(tab);
      // 다른 탭으로 이동 시 선택된 사용자 초기화
      if (tab !== 'otherProfile') {
        setSelectedUserId(null);
      }
    }
  };

  // 설정 페이지로 이동
  const handleNavigateToSettings = () => {
    setActiveTab('settings');
  };

  // 설정 페이지에서 뒤로가기
  const handleBackFromSettings = () => {
    setActiveTab('home');
  };

  // 회원탈퇴 핸들러
  const handleDeleteAccount = async () => {
    if (!currentUserData) {
      console.error('No current user data');
      return;
    }
    
    try {
      await MovieAPI.deleteUser(currentUserData.id);
      // 탈퇴 완료 후 로그아웃 및 로컬 스토리지 삭제
      handleLogout();
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  // 영화 별점 업데이트 함수 (실시간 피드 리뷰 데이터 기반)
  const updateMovieRating = useCallback(async (movieId: string) => {
    try {
      console.log(`[App] 🔄 Updating rating for movie ${movieId}...`);
      const posts = await MovieAPI.getMoviePosts(movieId);
      const reviewCount = posts.length;
      
      let rating = 0;
      if (reviewCount > 0) {
        const totalRating = posts.reduce((sum, post) => sum + post.rating, 0);
        rating = totalRating / reviewCount;
        console.log(`[App] ✅ Movie ${movieId} rating updated: ${rating.toFixed(2)}★ (${reviewCount} reviews)`);
      } else {
        console.log(`[App] ⚪ Movie ${movieId} has no reviews`);
      }
      
      // 영화 목록에서 해당 영화의 별점 업데이트
      setMovies(prevMovies => 
        prevMovies.map(movie => 
          movie.id === movieId 
            ? { ...movie, rating, reviewCount }
            : movie
        )
      );
    } catch (error) {
      console.error(`[App] ❌ Error updating movie rating for ${movieId}:`, error);
    }
  }, []);

  // 리뷰 저장 핸들러 (API 연동)
  const handleSaveReview = useCallback(async (reviewData: Omit<BlogPost, 'id' | 'author' | 'date' | 'authorId' | 'authorAvatar'>) => {
    if (!currentUserData) {
      console.error('No current user data');
      return;
    }
    
    try {
      const postData = {
        ...reviewData,
        author: currentUserData.name,
        authorId: currentUserData.id,
        authorAvatar: currentUserData.avatar
      };

      if (editingPost) {
        // 기존 포스트 수정
        const updatedPost = await MovieAPI.updatePost(editingPost.id, postData);
        if (updatedPost) {
          setUserBlogPosts(posts => posts.map(p => p.id === editingPost.id ? updatedPost : p));
          
          // 리뷰 수정 시 영화 별점 업데이트
          await updateMovieRating(reviewData.movieId);
        }
      } else {
        // 새 포스트 생성
        const newPost = await MovieAPI.addPost(postData);
        if (newPost) {
          setUserBlogPosts(posts => [newPost, ...posts]);
          
          // 리뷰 작성한 영화를 본 영화 목록에 자동 추가
          console.log(`[App] 🎬 Adding movie ${reviewData.movieId} to watched movies list`);
          if (!currentUserData.watchedMovies.includes(reviewData.movieId)) {
            const updatedWatchedMovies = [...currentUserData.watchedMovies, reviewData.movieId];
            try {
              await MovieAPI.updateUserWatchedMovies(currentUserData.id, updatedWatchedMovies);
              console.log(`[App] ✅ Movie added to watched list`);
            } catch (watchedError) {
              console.error('[App] ❌ Error adding movie to watched list:', watchedError);
            }
          }
          
          // 포스트 생성 후 현재 사용자 통계 업데이트
          try {
            const updatedCurrentUser = await MovieAPI.getUserById(currentUserData.id);
            if (updatedCurrentUser) {
              setCurrentUserData(updatedCurrentUser);
              setAllUsers(users => users.map(u => u.id === currentUserData.id ? updatedCurrentUser : u));
            }
          } catch (statsError) {
            console.error('Error updating user stats:', statsError);
          }
          
          // 새 리뷰 작성 시 영화 별점 업데이트
          await updateMovieRating(reviewData.movieId);
        }
      }
      
      setEditingPost(null);
    } catch (error) {
      console.error('Error saving review:', error);
      // 기존 로컬 방식으로 폴백
      const newPost: BlogPost = {
        ...reviewData,
        id: editingPost?.id || `post_${Date.now()}`,
        author: currentUserData.name,
        authorId: currentUserData.id,
        authorAvatar: currentUserData.avatar,
        date: new Date().toISOString().split('T')[0]
      };

      if (editingPost) {
        setUserBlogPosts(posts => posts.map(p => p.id === editingPost.id ? newPost : p));
      } else {
        setUserBlogPosts(posts => [newPost, ...posts]);
      }
      
      setEditingPost(null);
    }
  }, [editingPost, currentUserData, updateMovieRating]);

  // 팔로우 토글 핸들러 (API 연동)
  const handleFollowToggle = useCallback(async (userId: string) => {
    if (!currentUserData) {
      console.error('No current user data');
      return;
    }
    
    try {
      const isCurrentlyFollowing = followingIds.includes(userId);
      
      if (isCurrentlyFollowing) {
        // 언팔로우
        await MovieAPI.unfollowUser(currentUserData.id, userId);
        setFollowingIds(prev => prev.filter(id => id !== userId));
      } else {
        // 팔로우
        await MovieAPI.followUser(currentUserData.id, userId);
        setFollowingIds(prev => [...prev, userId]);
      }

      // 팔로우/언팔로우 후 사용자 통계 업데이트
      try {
        const updatedUser = await MovieAPI.getUserById(userId);
        if (updatedUser) {
          setAllUsers(users => users.map(u => u.id === userId ? updatedUser : u));
        }
      } catch (statsError) {
        console.error('Error updating user stats:', statsError);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      // 로컬 폴백
      setFollowingIds(prev => 
        prev.includes(userId)
          ? prev.filter(id => id !== userId)
          : [...prev, userId]
      );
    }
  }, [followingIds, currentUserData]);

  // 좋아요 토글 핸들러 (API 연동)
  const handleLikeToggle = useCallback(async (postId: string) => {
    if (!currentUserData) {
      console.error('No current user data');
      return;
    }
    
    try {
      // 모든 포스트에서 현재 포스트 찾기
      const currentPost = allPosts.find(p => p.id === postId);
      
      if (!currentPost) {
        console.error('Post not found in local state:', postId);
        return;
      }

      const newLikedState = !currentPost.isLiked;
      
      // API 호출
      const updatedPost = await MovieAPI.togglePostLike(postId, currentUserData.id, newLikedState);
      
      if (updatedPost) {
        // 로컬 상태 업데이트
        const updatePost = (post: BlogPost) => 
          post.id === postId ? updatedPost : post;

        setUserBlogPosts(posts => posts.map(updatePost));
        setAllBlogPosts(posts => posts.map(updatePost));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // 기존 로컬 방식으로 폴백
      const updatePost = (post: BlogPost) => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post;

      setUserBlogPosts(posts => posts.map(updatePost));
      setAllBlogPosts(posts => posts.map(updatePost));
    }
  }, [allPosts, allBlogPosts, currentUserData]);

  // 리뷰 편집 핸들러
  const handleEditPost = useCallback((post: BlogPost) => {
    setEditingPost(post);
    setWriteModalOpen(true);
  }, []);

  // 프로필에서 리뷰 작성 버튼 클릭
  const handleWriteReview = useCallback(() => {
    setEditingPost(null);
    setWriteModalOpen(true);
  }, []);

  // 사용자 프로필 클릭 핸들러
  const handleUserProfileClick = useCallback((userId: string) => {
    if (!currentUserData) return;
    
    // 자신의 프로필인지 확인
    if (userId === currentUserData.id) {
      setActiveTab('profile');
      setSelectedUserId(null);
    } else {
      setSelectedUserId(userId);
      setActiveTab('otherProfile');
    }
  }, [currentUserData]);

  // 다른 사용자 프로필에서 뒤로가기 핸들러
  const handleBackFromOtherProfile = useCallback(() => {
    setSelectedUserId(null);
    setActiveTab('feed'); // 피드로 돌아가기
  }, []);

  // 프로필 업데이트 핸들러
  const handleProfileUpdate = useCallback((userData: Partial<typeof currentUser>) => {
    const updatedUser = { ...currentUserData, ...userData };
    setCurrentUserData(updatedUser);
    
    // 기존 댓글들의 사용자 정보도 업데이트
    if (userData.name || userData.avatar) {
      setPostComments(prev => {
        const updatedComments: Record<string, Comment[]> = {};
        
        Object.entries(prev).forEach(([postId, comments]) => {
          updatedComments[postId] = updateCommentsUserInfo(comments, currentUserData.id, updatedUser);
        });
        
        return updatedComments;
      });
    }
  }, [currentUserData]);

  // 댓글에서 특정 사용자 정보 업데이트하는 헬퍼 함수
  const updateCommentsUserInfo = useCallback((comments: Comment[], userId: string, updatedUser: typeof currentUser): Comment[] => {
    return comments.map(comment => {
      let updatedComment = comment;
      
      // 현재 댓글이 업데이트할 사용자의 것인지 확인
      if (comment.authorId === userId) {
        updatedComment = {
          ...comment,
          author: updatedUser.name,
          authorAvatar: updatedUser.avatar
        };
      }
      
      // 답글들도 재귀적으로 업데이트
      if (comment.replies && comment.replies.length > 0) {
        updatedComment = {
          ...updatedComment,
          replies: updateCommentsUserInfo(comment.replies, userId, updatedUser)
        };
      }
      
      return updatedComment;
    });
  }, []);

  // 본 영화 업데이트 핸들러 (API 연동)
  const handleUpdateWatchedMovies = useCallback(async (movieIds: string[]) => {
    if (!currentUserData) {
      console.error('[App] ❌ No current user data');
      return;
    }
    
    try {
      console.log(`[App] 💾 Saving watched movies to database for user ${currentUserData.id}`, movieIds);
      
      // 데이터베이스에 저장
      await MovieAPI.updateUserWatchedMovies(currentUserData.id, movieIds);
      console.log('[App] ✅ Watched movies saved to database successfully');
      
      // 사용자 데이터 다시 로드하여 최신 정보 반영
      const updatedUser = await MovieAPI.getUserById(currentUserData.id);
      if (updatedUser) {
        setCurrentUserData(updatedUser);
        setAllUsers(users => users.map(u => u.id === currentUserData.id ? updatedUser : u));
        console.log('[App] ✅ User data refreshed from database');
      }
    } catch (error) {
      console.error('[App] ❌ Error saving watched movies to database:', error);
      // 에러 발생 시 로컬 상태만이라도 업데이트
      setCurrentUserData(prev => ({ 
        ...prev, 
        watchedMovies: movieIds,
        stats: {
          ...prev.stats,
          totalMoviesWatched: movieIds.length
        }
      }));
    }
  }, [currentUserData]);

  // 플랫폼 업데이트 핸들러 (API 연동)
  const handleUpdatePlatforms = useCallback(async (platforms: string[]) => {
    if (!currentUserData) {
      console.error('[App] ❌ No current user data');
      return;
    }
    
    try {
      console.log(`[App] 💾 Saving platforms to database for user ${currentUserData.id}`, platforms);
      
      // 데이터베이스에 저장
      await MovieAPI.updateUserPlatforms(currentUserData.id, platforms);
      console.log('[App] ✅ Platforms saved to database successfully');
      
      // 사용자 데이터 다시 로드하여 최신 정보 반영
      const updatedUser = await MovieAPI.getUserById(currentUserData.id);
      if (updatedUser) {
        setCurrentUserData(updatedUser);
        setAllUsers(users => users.map(u => u.id === currentUserData.id ? updatedUser : u));
        console.log('[App] ✅ User data refreshed from database');
      }
    } catch (error) {
      console.error('[App] ❌ Error saving platforms to database:', error);
      // 에러 발생 시 로컬 상태만이라도 업데이트
      setCurrentUserData(prev => ({ 
        ...prev, 
        stats: {
          ...prev.stats,
          platforms: platforms
        }
      }));
    }
  }, [currentUserData]);

  // 리뷰 삭제 핸들러 (API 연동)
  const handleDeletePost = useCallback(async (postId: string) => {
    if (!currentUserData) return;
    
    try {
      const success = await MovieAPI.deletePost(postId);
      if (success) {
        setUserBlogPosts(posts => posts.filter(p => p.id !== postId));
        setAllBlogPosts(posts => posts.filter(p => p.id !== postId));
        // 댓글도 함께 삭제
        setPostComments(prev => {
          const updated = { ...prev };
          delete updated[postId];
          return updated;
        });

        // 포스트 삭제 후 현재 사용자 통계 업데이트
        try {
          const updatedCurrentUser = await MovieAPI.getUserById(currentUserData.id);
          if (updatedCurrentUser) {
            setCurrentUserData(updatedCurrentUser);
            setAllUsers(users => users.map(u => u.id === currentUserData.id ? updatedCurrentUser : u));
          }
        } catch (statsError) {
          console.error('Error updating user stats:', statsError);
        }
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      // 기존 로컬 방식으로 폴백
      setUserBlogPosts(posts => posts.filter(p => p.id !== postId));
      setAllBlogPosts(posts => posts.filter(p => p.id !== postId));
      setPostComments(prev => {
        const updated = { ...prev };
        delete updated[postId];
        return updated;
      });
    }
  }, [currentUserData]);

  // 댓글 추가 핸들러 (API 연동)
  const handleAddComment = useCallback(async (postId: string, content: string) => {
    if (!currentUserData) return;
    
    try {
      console.log(`[App] 📝 Adding comment to post ${postId}`);
      const newComment = await MovieAPI.addComment(
        postId,
        content,
        currentUserData.id,
        currentUserData.name,
        currentUserData.avatar
      );
      
      if (newComment) {
        console.log(`[App] ✅ Comment added successfully`);
        // DB에서 최신 댓글 목록 다시 로드
        const updatedComments = await MovieAPI.getPostComments(postId);
        setPostComments(prev => ({
          ...prev,
          [postId]: updatedComments
        }));
      }
    } catch (error) {
      console.error('[App] ❌ Error adding comment:', error);
      // 로컬 폴백
      const comment: Comment = {
        id: `comment_${Date.now()}`,
        postId,
        author: currentUserData.name,
        authorId: currentUserData.id,
        authorAvatar: currentUserData.avatar,
        content: content.trim(),
        date: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        likedBy: [],
        replies: []
      };

      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
    }
  }, [currentUserData]);

  // 답글 추가 핸들러 (API 연동)
  const handleAddReply = useCallback(async (postId: string, parentId: string, content: string) => {
    if (!currentUserData) return;
    
    try {
      console.log(`[App] 💬 Adding reply to comment ${parentId} in post ${postId}`);
      const newReply = await MovieAPI.addComment(
        postId,
        content,
        currentUserData.id,
        currentUserData.name,
        currentUserData.avatar,
        parentId
      );
      
      if (newReply) {
        console.log(`[App] ✅ Reply added successfully`);
        // DB에서 최신 댓글 목록 다시 로드
        const updatedComments = await MovieAPI.getPostComments(postId);
        setPostComments(prev => ({
          ...prev,
          [postId]: updatedComments
        }));
      }
    } catch (error) {
      console.error('[App] ❌ Error adding reply:', error);
      // 로컬 폴백
      const reply: Comment = {
        id: `reply_${Date.now()}`,
        postId,
        author: currentUserData.name,
        authorId: currentUserData.id,
        authorAvatar: currentUserData.avatar,
        content: content.trim(),
        date: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        likedBy: [],
        parentId: parentId,
        replies: []
      };

      const addReplyToComment = (comments: Comment[], targetId: string): Comment[] => {
        return comments.map(comment => {
          if (comment.id === targetId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply]
            };
          } else if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToComment(comment.replies, targetId)
            };
          }
          return comment;
        });
      };

      setPostComments(prev => ({
        ...prev,
        [postId]: addReplyToComment(prev[postId] || [], parentId)
      }));
    }
  }, [currentUserData]);

  // 댓글 좋아요 토글 핸들러 (API 연동)
  const handleCommentLikeToggle = useCallback(async (postId: string, commentId: string) => {
    if (!currentUserData) return;
    
    try {
      console.log(`[App] 👍 Toggling like for comment ${commentId}`);
      const updatedComment = await MovieAPI.toggleCommentLike(commentId, currentUserData.id);
      
      if (updatedComment) {
        console.log(`[App] ✅ Comment like toggled successfully`);
        // DB에서 최신 댓글 목록 다시 로드
        const updatedComments = await MovieAPI.getPostComments(postId);
        setPostComments(prev => ({
          ...prev,
          [postId]: updatedComments
        }));
      }
    } catch (error) {
      console.error('[App] ❌ Error toggling comment like:', error);
      // 로컬 폴백
      const updateCommentLike = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            };
          } else if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentLike(comment.replies)
            };
          }
          return comment;
        });
      };

      setPostComments(prev => ({
        ...prev,
        [postId]: updateCommentLike(prev[postId] || [])
      }));
    }
  }, [currentUserData]);

  // 댓글 삭제 핸들러 (API 연동)
  const handleDeleteComment = useCallback(async (postId: string, commentId: string) => {
    try {
      console.log(`[App] 🗑️ Deleting comment ${commentId}`);
      const success = await MovieAPI.deleteComment(commentId);
      
      if (success) {
        console.log(`[App] ✅ Comment deleted successfully`);
        // DB에서 최신 댓글 목록 다시 로드
        const updatedComments = await MovieAPI.getPostComments(postId);
        setPostComments(prev => ({
          ...prev,
          [postId]: updatedComments
        }));
      }
    } catch (error) {
      console.error('[App] ❌ Error deleting comment:', error);
      // 로컬 폴백
      const deleteFromComments = (comments: Comment[]): Comment[] => {
        return comments.reduce((acc, comment) => {
          if (comment.id === commentId) {
            return acc;
          } else if (comment.replies && comment.replies.length > 0) {
            const updatedReplies = deleteFromComments(comment.replies);
            return [...acc, { ...comment, replies: updatedReplies }];
          } else {
            return [...acc, comment];
          }
        }, [] as Comment[]);
      };

      setPostComments(prev => ({
        ...prev,
        [postId]: deleteFromComments(prev[postId] || [])
      }));
    }
  }, []);

  // 피드 새로고침 핸들러
  const handleRefreshFeed = useCallback(async () => {
    if (!isAuthenticated || !authenticatedUser) return;

    try {
      console.log('Refreshing feed data...');
      
      // 모든 포스트 다시 로드
      const postsData = await MovieAPI.getAllPosts();
      setAllBlogPosts(postsData);
      
      // 사용자 포스트 다시 로드
      const userPosts = await MovieAPI.getUserPosts(authenticatedUser.id);
      setUserBlogPosts(userPosts);
      
      // 모든 사용자 다시 로드 (팔로워 수 등 최신화)
      const usersData = await MovieAPI.getAllUsers();
      setAllUsers(usersData);
      
      // 현재 사용자 정보 다시 로드
      const updatedCurrentUser = await MovieAPI.getUserById(authenticatedUser.id);
      if (updatedCurrentUser) {
        setCurrentUserData(updatedCurrentUser);
      }
      
      // 팔로잉 목록 다시 로드
      const followingList = await MovieAPI.getUserFollowing(authenticatedUser.id);
      setFollowingIds(followingList);
      
      // 포스트별 댓글 다시 로드
      console.log('Reloading comments for all posts...');
      const updatedPosts = await MovieAPI.getAllPosts();
      const commentsData: Record<string, Comment[]> = {};
      for (const post of updatedPosts) {
        try {
          const comments = await MovieAPI.getPostComments(post.id);
          if (comments.length > 0) {
            commentsData[post.id] = comments;
          }
        } catch (commentError) {
          console.error(`Error reloading comments for post ${post.id}:`, commentError);
          commentsData[post.id] = [];
        }
      }
      setPostComments(commentsData);
      
      console.log('Feed refreshed successfully');
    } catch (error) {
      console.error('Error refreshing feed:', error);
      throw error;
    }
  }, [isAuthenticated, authenticatedUser]);

  // 리뷰 데이터 리셋 핸들러 (디버깅용)
  const handleResetReviews = useCallback(async () => {
    try {
      console.log('🔄 Resetting movie reviews...');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-7f106327/reset-reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset reviews');
      }
      
      const data = await response.json();
      console.log('✅ Reviews reset successful:', data);
      
      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('❌ Error resetting reviews:', error);
      alert('리뷰 리셋 실패: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    }
  }, []);

  // 선택된 사용자 정보 가져오기 (메모이제이션)
  const selectedUser = useMemo(() => 
    selectedUserId 
      ? allUsers.find(user => user.id === selectedUserId)
      : null,
    [selectedUserId, allUsers]
  );

  // 모든 사용자 목록 (현재 사용자 + DB 사용자)
  const combinedUsers = useMemo(() => {
    if (!currentUserData) return allUsers;
    
    const userMap = new Map<string, UserProfile>();
    
    // 현재 사용자 추가
    userMap.set(currentUserData.id, currentUserData);
    
    // DB 사용자 추가
    allUsers.forEach(user => userMap.set(user.id, user));
    
    return Array.from(userMap.values());
  }, [currentUserData, allUsers]);

  // Show authentication pages if not logged in
  if (!isAuthenticated) {
    if (authPage === 'login') {
      return (
        <LoginPage
          onLogin={handleLogin}
          onNavigateToSignup={() => setAuthPage('signup')}
          onNavigateToFindId={() => setAuthPage('findId')}
          onNavigateToForgotPassword={() => setAuthPage('forgotPassword')}
        />
      );
    } else if (authPage === 'signup') {
      return (
        <SignupPage
          onSignup={handleSignup}
          onNavigateToLogin={() => setAuthPage('login')}
        />
      );
    } else if (authPage === 'forgotPassword') {
      return (
        <ForgotPasswordPage
          onResetPassword={handleResetPassword}
          onNavigateToLogin={() => setAuthPage('login')}
        />
      );
    } else if (authPage === 'findId') {
      return (
        <FindIdPage
          onFindId={handleFindId}
          onNavigateToLogin={() => setAuthPage('login')}
        />
      );
    }
  }

  // 플랫폼 확인
  const isNative = isNativePlatform();
  const platform = getPlatform();

  return (
    <>
      {/* 웹 브라우저에서만 PWA Head 렌더링 */}
      {!isNative && <PWAHead />}
      
      <div className="min-h-screen bg-background pb-20 sm:pb-0 relative popcorn-pattern">
      {/* 헤더 (설정 페이지에서는 숨김) */}
      {activeTab !== 'settings' && (
        <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 cinema-glow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Popcorn className="size-6 sm:size-8 text-primary drop-shadow-lg" />
                <Sparkles className="size-3 absolute -top-1 -right-1 text-primary/70 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  FILM NOTE
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  영화관에서 만나는 리뷰 커뮤니티
                </p>
              </div>
            </div>
            
            <div className="sm:hidden flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="px-2"
              >
                {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNavigateToSettings}
                className="text-xs border-primary/30 text-primary px-2"
              >
                ⚙️
              </Button>
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              {currentUserData && (
                <span className="text-sm text-muted-foreground">{currentUserData.name}님</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title="다크모드 전환"
              >
                {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetReviews}
                className="text-xs border-primary/50 text-primary hover:bg-primary/10 hover:border-primary"
                title="리뷰 데이터베이스 재초기화 (디버깅용)"
              >
                🔄 리뷰 DB 리셋
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNavigateToSettings}
                title="설정"
              >
                ⚙️
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </div>
          </div>
        </div>
        </header>
      )}

      <main className={activeTab === 'settings' ? '' : 'container mx-auto px-4 py-8 space-y-8'}>

        {/* 탭별 컨텐츠 렌더링 */}
        {activeTab === 'home' && (
          <>
            {/* 로딩 상태 */}
            {loading && (
              <div className="space-y-8">
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <MovieCardSkeleton key={i} />
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* 에러 상태 */}
            {error && !loading && (
              <HomeErrorState onRetry={() => window.location.reload()} />
            )}

            {/* Empty 상태 */}
            {!loading && !error && movies.length === 0 && (
              <HomeEmptyState />
            )}

            {/* 정상 상태 - 데스크톱 */}
            {!loading && !error && movies.length > 0 && (
              <>
                {/* 데스크톱 필터 */}
                <section className="hidden sm:block">
                  <FilterTabs
                    selectedGenre={selectedGenre}
                    selectedPlatform={selectedPlatform}
                    onGenreChange={setSelectedGenre}
                    onPlatformChange={setSelectedPlatform}
                    genreCounts={genreCounts}
                    platformCounts={platformCounts}
                  />
                </section>

                {/* 데스크톱 검색 결과 또는 기본 섹션 */}
                <div className="hidden sm:block space-y-8">
                  {searchQuery ? (
                    <section>
                      <div className="flex items-center gap-2 mb-6">
                        <h2>검색 결과</h2>
                        <Badge variant="secondary">
                          {filteredMovies.length}개 영화
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredMovies.map((movie) => (
                          <MovieCard
                            key={movie.id}
                            movie={movie}
                            onClick={setSelectedMovie}
                          />
                        ))}
                      </div>
                      
                      {filteredMovies.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                        </div>
                      )}
                    </section>
                  ) : (
                    <>
                      {/* 🔥 오늘의 추천작 */}
                      {todaysPicks.length > 0 && (
                        <section>
                          <div className="flex items-center gap-2 mb-6">
                            <Flame className="size-5 text-primary" />
                            <h2>🔥 오늘의 추천작</h2>
                            <Badge variant="secondary">평점 4.5+</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {todaysPicks.map((movie) => (
                              <MovieCard
                                key={movie.id}
                                movie={movie}
                                onClick={setSelectedMovie}
                              />
                            ))}
                          </div>
                        </section>
                      )}

                      {/* ⭐ 평점 높은 영화 */}
                      {topRatedByYear.length > 0 && (
                        <section>
                          <div className="flex items-center gap-2 mb-6">
                            <StarIcon className="size-5 text-primary fill-primary" />
                            <h2>⭐ 평점 높은 영화</h2>
                            <Badge variant="secondary">연도별 TOP 5</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {topRatedByYear.map((movie) => (
                              <MovieCard
                                key={movie.id}
                                movie={movie}
                                onClick={setSelectedMovie}
                              />
                            ))}
                          </div>
                        </section>
                      )}

                      {/* 🎬 최신 등록 영화 */}
                      {latestMovies.length > 0 && (
                        <section>
                          <div className="flex items-center gap-2 mb-6">
                            <Clapperboard className="size-5 text-primary" />
                            <h2>🎬 최신 등록 영화</h2>
                            <Badge variant="secondary">올해 개봉작</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {latestMovies.map((movie) => (
                              <MovieCard
                                key={movie.id}
                                movie={movie}
                                onClick={setSelectedMovie}
                              />
                            ))}
                          </div>
                        </section>
                      )}

                      {/* 인기 영화 섹션 */}
                      {popularMovies.length > 0 && (
                        <section>
                          <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="size-5 text-primary" />
                            <h2>인기 영화</h2>
                            <Badge variant="secondary">평점 4.0+</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {popularMovies.map((movie) => (
                              <MovieCard
                                key={movie.id}
                                movie={movie}
                                onClick={setSelectedMovie}
                              />
                            ))}
                          </div>
                        </section>
                      )}

                      {/* 최신 영화 섹션 */}
                      {recentMovies.length > 0 && (
                        <section>
                          <div className="flex items-center gap-2 mb-6">
                            <Award className="size-5 text-primary" />
                            <h2>최신 영화</h2>
                            <Badge variant="secondary">2025년 신작</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {recentMovies.map((movie) => (
                              <MovieCard
                                key={movie.id}
                                movie={movie}
                                onClick={setSelectedMovie}
                              />
                            ))}
                          </div>
                        </section>
                      )}
                    </>
                  )}
                </div>

                {/* 모바일 홈 화면 */}
                <div className="sm:hidden space-y-8">
                  {/* 🔥 오늘의 추천작 */}
                  {todaysPicks.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Flame className="size-5 text-primary" />
                        </div>
                        <div>
                          <h2>🔥 오늘의 추천작</h2>
                          <p className="text-xs text-muted-foreground">평점 4.5+ 영화들</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {todaysPicks.map((movie) => (
                          <MovieCard
                            key={movie.id}
                            movie={movie}
                            onClick={setSelectedMovie}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ⭐ 평점 높은 영화 */}
                  {topRatedByYear.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <StarIcon className="size-5 text-primary fill-primary" />
                        </div>
                        <div>
                          <h2>⭐ 평점 높은 영화</h2>
                          <p className="text-xs text-muted-foreground">연도별 TOP 5</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {topRatedByYear.slice(0, 4).map((movie) => (
                          <MovieCard
                            key={movie.id}
                            movie={movie}
                            onClick={setSelectedMovie}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* 🎬 최신 등록 영화 */}
                  {latestMovies.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Clapperboard className="size-5 text-primary" />
                        </div>
                        <div>
                          <h2>🎬 최신 등록 영화</h2>
                          <p className="text-xs text-muted-foreground">올해 개봉작</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {latestMovies.map((movie) => (
                          <MovieCard
                            key={movie.id}
                            movie={movie}
                            onClick={setSelectedMovie}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* 인기 영화 섹션 */}
                  {popularMovies.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <TrendingUp className="size-5 text-primary" />
                        </div>
                        <div>
                          <h2>🔥 인기 영화</h2>
                          <p className="text-xs text-muted-foreground">평점 4.0+ 영화들</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {popularMovies.slice(0, 4).map((movie) => (
                          <MovieCard
                            key={movie.id}
                            movie={movie}
                            onClick={setSelectedMovie}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* 최신 영화 섹션 */}
                  {recentMovies.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Award className="size-5 text-primary" />
                        </div>
                        <div>
                          <h2>✨ 최신 영화</h2>
                          <p className="text-xs text-muted-foreground">2025년 신작들</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {recentMovies.slice(0, 4).map((movie) => (
                          <MovieCard
                            key={movie.id}
                            movie={movie}
                            onClick={setSelectedMovie}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {!loading && !error && activeTab === 'feed' && currentUserData && (
          <FeedPage
            posts={allPosts}
            users={combinedUsers}
            currentUser={currentUserData}
            postComments={postComments}
            onFollowToggle={handleFollowToggle}
            onLikeToggle={handleLikeToggle}
            onUserProfileClick={handleUserProfileClick}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            onCommentLikeToggle={handleCommentLikeToggle}
            onDeleteComment={handleDeleteComment}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
            followingIds={followingIds}
            loading={postsLoading}
            onRefresh={handleRefreshFeed}
          />
        )}

        {!loading && !error && activeTab === 'search' && (
          <SearchPage onMovieSelect={setSelectedMovie} />
        )}

        {!loading && !error && activeTab === 'profile' && (
          <ProfilePage
            user={currentUserData}
            blogPosts={userBlogPosts}
            allUsers={combinedUsers}
            followingIds={followingIds}
            postComments={postComments}
            onEditPost={handleEditPost}
            onWriteReview={handleWriteReview}
            onDeletePost={handleDeletePost}
            onUpdateWatchedMovies={handleUpdateWatchedMovies}
            onUpdatePlatforms={handleUpdatePlatforms}
            onProfileUpdate={handleProfileUpdate}
            onFollowToggle={handleFollowToggle}
            onUserProfileClick={handleUserProfileClick}
            onLikeToggle={handleLikeToggle}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            onCommentLikeToggle={handleCommentLikeToggle}
            onDeleteComment={handleDeleteComment}
            onLogin={() => {
              setIsAuthenticated(false);
              setAuthPage('login');
            }}
          />
        )}

        {!loading && !error && activeTab === 'otherProfile' && selectedUser && currentUserData && (
          <OtherUserProfilePage
            user={selectedUser}
            blogPosts={allPosts}
            allUsers={combinedUsers}
            followingIds={followingIds}
            isFollowing={followingIds.includes(selectedUser.id)}
            onBack={handleBackFromOtherProfile}
            onFollowToggle={handleFollowToggle}
            onLikeToggle={handleLikeToggle}
            onUserProfileClick={handleUserProfileClick}
            currentUser={currentUserData}
            postComments={postComments}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            onCommentLikeToggle={handleCommentLikeToggle}
            onDeleteComment={handleDeleteComment}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            isDarkMode={isDarkMode}
            onToggleDarkMode={setIsDarkMode}
            onLogout={handleLogout}
            onBack={handleBackFromSettings}
            onDeleteAccount={handleDeleteAccount}
          />
        )}

        {/* 영화 상세 모달 */}
        <MovieModal
          movie={selectedMovie}
          open={!!selectedMovie}
          onOpenChange={(open) => !open && setSelectedMovie(null)}
          onWriteReview={(movie) => {
            setPreSelectedMovieId(movie.id);
            setEditingPost(null);
            setWriteModalOpen(true);
          }}
          currentUserId={currentUserData?.id}
          allUsers={combinedUsers}
          followingIds={followingIds}
          onLikeToggle={handleLikeToggle}
          onFollowToggle={handleFollowToggle}
          onUserProfileClick={handleUserProfileClick}
          onAddComment={handleAddComment}
          onAddReply={handleAddReply}
          onCommentLikeToggle={handleCommentLikeToggle}
          onDeleteComment={handleDeleteComment}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />

        {/* 리뷰 작성 모달 */}
        <EnhancedWriteReviewModal
          open={writeModalOpen}
          onOpenChange={(open) => {
            setWriteModalOpen(open);
            if (!open) {
              setPreSelectedMovieId(undefined);
            }
          }}
          editingPost={editingPost}
          onSave={handleSaveReview}
          preSelectedMovieId={preSelectedMovieId}
        />
      </main>

      {/* 데스크톱 푸터 (설정 페이지에서는 숨김) */}
      {activeTab !== 'settings' && (
        <footer className="hidden sm:block border-t bg-muted/30 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Film className="size-5 text-primary" />
            <span>MovieReview</span>
          </div>
          <p className="text-sm text-muted-foreground">
            영화 리뷰와 평점을 한눈에 확인하세요
          </p>
        </div>
        </footer>
      )}

      {/* 모바일 하단 네비게이션 (설정 페이지에서는 숨김) */}
      {activeTab !== 'settings' && (
        <div className="sm:hidden">
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        </div>
      )}

      {/* PWA 설치 프롬프트 (웹 브라우저에서만 표시) */}
      {!isNative && (
        <>
          <PWAInstallPrompt />
          <IOSInstallPrompt />
        </>
      )}

      {/* 네이티브 앱 디버그 정보 (개발 중에만 표시) */}
      {isNative && process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-24 right-4 bg-slate-900/90 text-white text-xs p-3 rounded-lg z-50 border border-slate-700">
          <div className="font-bold mb-1">🚀 Capacitor 네이티브 앱</div>
          <div>플랫폼: {platform}</div>
        </div>
      )}
      </div>
    </>
  );
}