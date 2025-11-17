import { useState, useEffect, useMemo, useRef } from 'react';
import { UserProfile, BlogPost, Movie } from '../types/movie';
import { MovieAPI } from '../utils/movieApi';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { VerificationBadge } from './VerificationBadge';
import { WatchedMoviesModal } from './WatchedMoviesModal';
import { PlatformManagerModal } from './PlatformManagerModal';
import { ProfileEditModal } from './ProfileEditModal';
import { FollowListModal } from './FollowListModal';
import { PostDetailModal } from './PostDetailModal';
import { ShareModal } from './ShareModal';
import { 
  Star, 
  Film, 
  Calendar, 
  Award, 
  Heart, 
  MessageSquare, 
  Edit,
  Tv,
  TrendingUp,
  Eye,
  Settings,
  Trash2,
  Users,
  UserPlus,
  Camera,
  PieChart,
  Plus
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// 댓글 타입 정의
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
  likedBy: string[];
  replies?: Comment[];
  parentId?: string;
}

interface ProfilePageProps {
  user: UserProfile | null;
  blogPosts: BlogPost[];
  allUsers: UserProfile[];
  followingIds: string[];
  postComments?: Record<string, Comment[]>;
  onEditPost?: (post: BlogPost) => void;
  onWriteReview?: () => void;
  onDeletePost?: (postId: string) => void;
  onUpdateWatchedMovies?: (movieIds: string[]) => void;
  onUpdatePlatforms?: (platforms: string[]) => void;
  onProfileUpdate?: (userData: Partial<UserProfile>) => void;
  onFollowToggle?: (userId: string) => void;
  onUserProfileClick?: (userId: string) => void;
  onLikeToggle?: (postId: string) => void;
  onAddComment?: (postId: string, content: string) => void;
  onAddReply?: (postId: string, parentId: string, content: string) => void;
  onCommentLikeToggle?: (postId: string, commentId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onLogin?: () => void;
}

// 파스텔 톤 색상
const COLORS = {
  '드라마': '#4ADE80',    // 초록색
  '액션': '#FFB4B4',      // 연한 빨강
  '로맨스': '#B4D4FF',    // 연한 파랑
  '스릴러': '#D4B4FF',    // 연한 보라
  '다큐': '#FFE4B4',      // 연한 노랑
  'SF': '#B4FFFF',        // 연한 청록
  '코미디': '#FFD4B4',    // 연한 주황
  '공포': '#FFB4E4',      // 연한 분홍
  '범죄': '#C4C4C4',      // 연한 회색
  '판타지': '#E4B4FF',    // 연한 라벤더
  'Action': '#FFB4B4',
  'Romance': '#B4D4FF',
  'Thriller': '#D4B4FF',
  'Documentary': '#FFE4B4',
  'Comedy': '#FFD4B4',
  'Horror': '#FFB4E4',
  'Crime': '#C4C4C4',
  'Fantasy': '#E4B4FF'
};

export function ProfilePage({ 
  user, 
  blogPosts, 
  allUsers,
  followingIds,
  postComments = {},
  onEditPost, 
  onWriteReview,
  onDeletePost,
  onUpdateWatchedMovies,
  onUpdatePlatforms,
  onProfileUpdate,
  onFollowToggle,
  onUserProfileClick,
  onLikeToggle,
  onAddComment,
  onAddReply,
  onCommentLikeToggle,
  onDeleteComment,
  onLogin
}: ProfilePageProps) {
  const [watchedMoviesModalOpen, setWatchedMoviesModalOpen] = useState(false);
  const [platformManagerModalOpen, setPlatformManagerModalOpen] = useState(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const [followListModalOpen, setFollowListModalOpen] = useState(false);
  const [followListType, setFollowListType] = useState<'followers' | 'following'>('followers');
  const [followListUsers, setFollowListUsers] = useState<UserProfile[]>([]);
  const [loadingFollowList, setLoadingFollowList] = useState(false);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [sharePost, setSharePost] = useState<BlogPost | null>(null);
  const [scrollToComments, setScrollToComments] = useState(false);
  
  // 리뷰 섹션 참조
  const reviewsSectionRef = useRef<HTMLDivElement>(null);
  
  // 영화 데이터 로드
  useEffect(() => {
    const loadMovies = async () => {
      setLoadingMovies(true);
      try {
        const movies = await MovieAPI.getAllMovies();
        setAllMovies(movies);
      } catch (error) {
        console.error('Error loading movies:', error);
        setAllMovies([]);
      } finally {
        setLoadingMovies(false);
      }
    };
    
    loadMovies();
  }, []);
  
  const platformColors = {
    'Netflix': 'bg-red-500',
    'Disney+': 'bg-blue-500',
    'Wavve': 'bg-purple-500',
    'Tving': 'bg-orange-500'
  };

  // 팔로워/팔로잉 목록을 데이터베이스에서 로드
  const loadFollowList = async (type: 'followers' | 'following') => {
    if (!user) return;
    setLoadingFollowList(true);
    setFollowListType(type);
    try {
      let users: UserProfile[] = [];
      if (type === 'followers') {
        users = await MovieAPI.getUserFollowersDetails(user.id);
      } else {
        users = await MovieAPI.getUserFollowingDetails(user.id);
      }
      setFollowListUsers(users);
      setFollowListModalOpen(true);
    } catch (error) {
      console.error('Error loading follow list:', error);
      setFollowListUsers([]);
    } finally {
      setLoadingFollowList(false);
    }
  };

  // 감상한 영화 객체 배열 (자동 계산)
  const watchedMoviesData = useMemo(() => {
    if (!user || !allMovies.length) return [];
    return allMovies.filter(movie => user.watchedMovies.includes(movie.id));
  }, [user?.watchedMovies, allMovies]);

  // 올해 본 영화 수 (자동 계산)
  const moviesThisYear = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return watchedMoviesData.filter(movie => movie.year === currentYear).length;
  }, [watchedMoviesData]);

  // 장르별 통계 (자동 집계)
  const genreStats = useMemo(() => {
    const stats: Record<string, number> = {};
    
    watchedMoviesData.forEach(movie => {
      const genre = movie.genre;
      stats[genre] = (stats[genre] || 0) + 1;
    });
    
    return Object.entries(stats)
      .map(([genre, count]) => ({
        name: genre,
        value: count,
        color: COLORS[genre as keyof typeof COLORS] || '#B4B4FF'
      }))
      .sort((a, b) => b.value - a.value); // 많은 순으로 정렬
  }, [watchedMoviesData]);

  // 가장 많이 본 장르
  const topGenre = useMemo(() => {
    if (genreStats.length === 0) return '-';
    return genreStats[0].name;
  }, [genreStats]);

  // 실제 리뷰 데이터 기반 평균 평점 계산
  const averageRating = useMemo(() => {
    if (blogPosts.length === 0) return 0;
    const sum = blogPosts.reduce((acc, post) => acc + post.rating, 0);
    return sum / blogPosts.length;
  }, [blogPosts]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }, (_, i) => (
          <Star
            key={`full-${i}`}
            className="size-3.5 fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <div className="relative size-3.5">
            <Star className="absolute inset-0 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {Array.from({ length: 5 - Math.ceil(rating) }, (_, i) => (
          <Star
            key={`empty-${i}`}
            className="size-3.5 text-gray-300"
          />
        ))}
      </div>
    );
  };

  // 리뷰 섹션으로 스크롤하는 함수
  const scrollToReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 로그아웃 상태
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="cinema-glow">
          <CardContent className="py-16 text-center">
            <Film className="size-16 mx-auto mb-4 text-primary opacity-50" />
            <h2 className="text-xl mb-2">로그인 후 내 감상 기록을 볼 수 있습니다</h2>
            <p className="text-sm text-muted-foreground mb-6">
              영화 리뷰를 작성하고 통계를 확인해보세요
            </p>
            <Button onClick={onLogin} className="gap-2">
              로그인하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 데이터 없음 상태
  const hasNoData = blogPosts.length === 0 && user.watchedMovies.length === 0;
  
  if (hasNoData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 프로필 헤더 */}
        <Card className="cinema-glow">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="size-24 sm:size-32 ring-2 ring-primary/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl">{user.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left space-y-4">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                    <h1 className="text-lg truncate max-w-[200px]">{user.name}</h1>
                    {user.verified && <VerificationBadge level={user.verified} />}
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setProfileEditModalOpen(true)}
                        className="size-9 p-2 hover:text-primary transition-colors"
                      >
                        <Camera className="size-5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm truncate">{user.email}</p>
                  
                  {/* 가입일, 팔로워, 팔로잉 정보 */}
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-primary" />
                      <span className="text-sm text-muted-foreground">가입일</span>
                      <span className="text-sm text-foreground">{new Date(user.joinDate).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => loadFollowList('followers')}
                        disabled={loadingFollowList}
                        className="flex items-center gap-2 hover:text-primary transition-colors disabled:opacity-50"
                      >
                        <Users className="size-4 text-primary" />
                        <span className="text-sm text-muted-foreground">팔로워</span>
                        <span className="text-sm text-foreground">{user.followersCount.toLocaleString()}</span>
                      </button>
                      <button
                        onClick={() => loadFollowList('following')}
                        disabled={loadingFollowList}
                        className="flex items-center gap-2 hover:text-primary transition-colors disabled:opacity-50"
                      >
                        <UserPlus className="size-4 text-primary" />
                        <span className="text-sm text-muted-foreground">팔로잉</span>
                        <span className="text-sm text-foreground">{followingIds.length.toLocaleString()}</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {user.bio && (
                  <p className="text-sm text-muted-foreground max-w-md line-clamp-3">{user.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cinema-glow">
          <CardContent className="py-16 text-center">
            <Film className="size-16 mx-auto mb-4 text-primary opacity-50" />
            <h2 className="text-xl mb-2">아직 감상 기록이 없어요</h2>
            <p className="text-sm text-muted-foreground mb-6">
              영화를 추가하고 나만의 감상 통계를 만들어보세요
            </p>
            <Button onClick={() => setWatchedMoviesModalOpen(true)} className="gap-2">
              <Plus className="size-4" />
              감상 기록 추가
            </Button>
          </CardContent>
        </Card>

        {/* 프로필 편집 모달 */}
        <ProfileEditModal
          user={user}
          open={profileEditModalOpen}
          onOpenChange={setProfileEditModalOpen}
          onSave={(userData) => {
            onProfileUpdate?.(userData);
            setProfileEditModalOpen(false);
          }}
        />

        {/* 감상 기록 추가 모달 */}
        <WatchedMoviesModal
          open={watchedMoviesModalOpen}
          onOpenChange={setWatchedMoviesModalOpen}
          watchedMovies={user.watchedMovies}
          onSave={(movieIds) => {
            onUpdateWatchedMovies?.(movieIds);
            setWatchedMoviesModalOpen(false);
          }}
          movies={allMovies}
        />

        {/* 팔로우 목록 모달 */}
        <FollowListModal
          open={followListModalOpen}
          onOpenChange={setFollowListModalOpen}
          type={followListType}
          users={followListUsers}
          currentUserId={user.id}
          followingIds={followingIds}
          onFollowToggle={onFollowToggle || (() => {})}
          onUserProfileClick={onUserProfileClick || (() => {})}
        />
      </div>
    );
  }

  // 총 리뷰 수 표시 (실제 데이터)
  const totalReviews = blogPosts.length;

  // 그래프에 표시할 데이터 (0보다 큰 것만)
  const chartData = genreStats.filter(g => g.value > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 프로필 헤더 */}
      <Card className="cinema-glow">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="size-24 sm:size-32 ring-2 ring-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl">{user.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-left space-y-4">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  <h1 className="text-lg truncate max-w-[200px]">{user.name}</h1>
                  {user.verified && <VerificationBadge level={user.verified} />}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setProfileEditModalOpen(true)}
                      className="size-9 p-2 hover:text-primary transition-colors"
                    >
                      <Camera className="size-5" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm truncate">{user.email}</p>
                
                {/* 가입일, 팔로워, 팔로잉 정보 */}
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-primary" />
                    <span className="text-sm text-muted-foreground">가입일</span>
                    <span className="text-sm text-foreground">{new Date(user.joinDate).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => loadFollowList('followers')}
                      disabled={loadingFollowList}
                      className="flex items-center gap-2 hover:text-primary transition-colors disabled:opacity-50"
                    >
                      <Users className="size-4 text-primary" />
                      <span className="text-sm text-muted-foreground">팔로워</span>
                      <span className="text-sm text-foreground">{user.followersCount.toLocaleString()}</span>
                    </button>
                    <button
                      onClick={() => loadFollowList('following')}
                      disabled={loadingFollowList}
                      className="flex items-center gap-2 hover:text-primary transition-colors disabled:opacity-50"
                    >
                      <UserPlus className="size-4 text-primary" />
                      <span className="text-sm text-muted-foreground">팔로잉</span>
                      <span className="text-sm text-foreground">{followingIds.length.toLocaleString()}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {user.bio && (
                <p className="text-sm text-muted-foreground max-w-md line-clamp-3">{user.bio}</p>
              )}

              <Button onClick={onWriteReview} className="gap-2">
                <Edit className="size-4" />
                새 리뷰 작성
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 감상 통계 섹션 (자동 집계) */}
      <Card className="cinema-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              나의 감상 기록
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWatchedMoviesModalOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4" />
              영화 추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 통계 카드 4개 (자동 계산) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-all border border-primary/10">
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-1 mb-2">
                  <Calendar className="size-5 text-primary" />
                  <span className="text-xl text-foreground">{moviesThisYear.toLocaleString()}편</span>
                </div>
                <div className="text-sm text-muted-foreground">올해 본 영화</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all border border-primary/10">
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-1 mb-2">
                  <Star className="size-5 text-yellow-400" />
                  <div className="flex items-center gap-1">
                    <span className="text-xl text-foreground">★{averageRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">평균 평점</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all border border-primary/10">
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-1 mb-2">
                  <Film className="size-5 text-primary" />
                  <span className="text-xl text-foreground truncate max-w-full px-2">{topGenre}</span>
                </div>
                <div className="text-sm text-muted-foreground">가장 많이 본 장르</div>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-md transition-all border border-primary/10 cursor-pointer"
              onClick={scrollToReviews}
            >
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center gap-1 mb-2">
                  <MessageSquare className="size-5 text-primary" />
                  <span className="text-xl text-foreground">{totalReviews.toLocaleString()}개</span>
                </div>
                <div className="text-sm text-muted-foreground">총 리뷰 수</div>
              </CardContent>
            </Card>
          </div>

          {/* 원형 그래프 (자동 집계 데이터) */}
          {chartData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm mb-4 flex items-center gap-2">
                <PieChart className="size-4" />
                장르별 감상 통계 (총 {watchedMoviesData.length}편)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => {
                        const displayName = name.length > 6 ? name.slice(0, 6) + '...' : name;
                        return `${displayName} ${(percent * 100).toFixed(0)}%`;
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 장르별 상세 통계 */}
          {chartData.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {chartData.map((stat) => (
                  <div
                    key={stat.name}
                    className="flex items-center gap-2 p-3 rounded-lg border border-primary/10"
                  >
                    <div
                      className="size-4 rounded-full shrink-0"
                      style={{ backgroundColor: stat.color }}
                    />
                    <span className="text-sm truncate flex-1">{stat.name}</span>
                    <span className="text-sm shrink-0">{stat.value}편</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 통계 카드들 */}


      {/* 이용 중인 플랫폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tv className="size-5" />
              이용 중인 OTT 플랫폼
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPlatformManagerModalOpen(true)}
              className="gap-2"
            >
              <Settings className="size-4" />
              관리
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.stats.platforms.map((platform) => (
              <Badge key={platform} className="gap-2">
                <div 
                  className={`size-2 rounded-full ${
                    platformColors[platform as keyof typeof platformColors] || 'bg-gray-500'
                  }`} 
                />
                <span className="truncate max-w-[150px]">{platform}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 내 리뷰 목록 */}
      <div ref={reviewsSectionRef}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5" />
              내가 작성한 리뷰 ({totalReviews.toLocaleString()})
            </CardTitle>
          </CardHeader>
        <CardContent>
          {blogPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="size-12 mx-auto mb-4 opacity-50" />
              <p>아직 작성한 리뷰가 없습니다</p>
              <p className="text-sm">첫 번째 리뷰를 작성해보세요</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow" style={{ minHeight: '80px' }}>
                    <CardContent 
                      className="p-3"
                      onClick={() => {
                        setSelectedPost(post);
                        setScrollToComments(false);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="line-clamp-1 pr-4 text-sm flex-1">{post.title}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditPost?.(post);
                            }}
                            className="size-8 p-0"
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
                                onDeletePost?.(post.id);
                              }
                            }}
                            className="size-8 p-0 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(post.rating)}
                        </div>
                        <span className="text-xs text-muted-foreground">{post.rating}.0</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs truncate max-w-[100px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className={`size-3 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                            <span>{post.likes.toLocaleString()}</span>
                          </div>
                          <span className="truncate max-w-[100px]">{new Date(post.date).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      </div>

      {/* 본 영화 관리 모달 */}
      <WatchedMoviesModal
        open={watchedMoviesModalOpen}
        onOpenChange={setWatchedMoviesModalOpen}
        watchedMovies={user.watchedMovies}
        onSave={(movieIds) => {
          onUpdateWatchedMovies?.(movieIds);
          setWatchedMoviesModalOpen(false);
        }}
        movies={allMovies}
      />

      {/* 플랫폼 관리 모달 */}
      <PlatformManagerModal
        open={platformManagerModalOpen}
        onOpenChange={setPlatformManagerModalOpen}
        currentPlatforms={user.stats.platforms}
        onSave={(platforms) => {
          onUpdatePlatforms?.(platforms);
          setPlatformManagerModalOpen(false);
        }}
      />

      {/* 프로필 편집 모달 */}
      <ProfileEditModal
        user={user}
        open={profileEditModalOpen}
        onOpenChange={setProfileEditModalOpen}
        onSave={(userData) => {
          onProfileUpdate?.(userData);
          setProfileEditModalOpen(false);
        }}
      />

      {/* 팔로우 목록 모달 */}
      <FollowListModal
        open={followListModalOpen}
        onOpenChange={setFollowListModalOpen}
        type={followListType}
        users={followListUsers}
        currentUserId={user.id}
        followingIds={followingIds}
        onFollowToggle={onFollowToggle || (() => {})}
        onUserProfileClick={onUserProfileClick || (() => {})}
      />

      {/* 포스트 상세보기 모달 */}
      <PostDetailModal
        post={selectedPost}
        author={selectedPost ? allUsers.find(u => u.id === selectedPost.authorId) || user : null}
        currentUser={user}
        comments={selectedPost ? postComments[selectedPost.id] || [] : []}
        open={!!selectedPost}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPost(null);
            setScrollToComments(false);
          }
        }}
        onLikeToggle={onLikeToggle}
        onFollowToggle={onFollowToggle}
        onSharePost={(post) => setSharePost(post)}
        onUserProfileClick={onUserProfileClick}
        onAddComment={onAddComment}
        onAddReply={onAddReply}
        onCommentLikeToggle={onCommentLikeToggle}
        onDeleteComment={onDeleteComment}
        onEditPost={onEditPost}
        onDeletePost={onDeletePost}
        isFollowing={selectedPost ? followingIds.includes(selectedPost.authorId) : false}
        scrollToComments={scrollToComments}
      />

      {/* 공유 모달 */}
      <ShareModal
        post={sharePost}
        open={!!sharePost}
        onOpenChange={(open) => !open && setSharePost(null)}
      />
    </div>
  );
}
