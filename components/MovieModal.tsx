import { useState, useEffect, useMemo } from 'react';
import { Movie, BlogPost, UserProfile, Comment } from '../types/movie';
import { MovieAPI } from '../utils/movieApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Star, Clock, Calendar, User, X, MessageCircle, AlertCircle, RefreshCw, Heart } from 'lucide-react';
import { DialogClose } from './ui/dialog';
import { displayGenre } from '../utils/genreHelper';
import { SpoilerContent } from './SpoilerContent';
import { PostDetailModal } from './PostDetailModal';
import { ShareModal } from './ShareModal';

interface MovieModalProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWriteReview?: (movie: Movie) => void;
  currentUserId?: string;
  allUsers?: UserProfile[];
  followingIds?: string[];
  onLikeToggle?: (postId: string) => void;
  onFollowToggle?: (userId: string) => void;
  onUserProfileClick?: (userId: string) => void;
  onAddComment?: (postId: string, content: string) => void;
  onAddReply?: (postId: string, parentId: string, content: string) => void;
  onCommentLikeToggle?: (postId: string, commentId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onEditPost?: (post: BlogPost) => void;
  onDeletePost?: (postId: string) => void;
}

export function MovieModal({ 
  movie, 
  open, 
  onOpenChange, 
  onWriteReview, 
  currentUserId,
  allUsers = [],
  followingIds = [],
  onLikeToggle,
  onFollowToggle,
  onUserProfileClick,
  onAddComment,
  onAddReply,
  onCommentLikeToggle,
  onDeleteComment,
  onEditPost,
  onDeletePost
}: MovieModalProps) {
  const [moviePosts, setMoviePosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<BlogPost | null>(null);
  const [reviewDetailModalOpen, setReviewDetailModalOpen] = useState(false);
  const [spoilerConsents, setSpoilerConsents] = useState<Record<string, boolean>>({});
  const [selectedAuthor, setSelectedAuthor] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  const [sharePost, setSharePost] = useState<BlogPost | null>(null);
  const [scrollToComments, setScrollToComments] = useState(false);

  // 영화 포스트 로드
  useEffect(() => {
    const loadPosts = async () => {
      if (!movie) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`[MovieModal] 📽️ Loading posts for movie "${movie.title}" (ID: ${movie.id})`);
        const posts = await MovieAPI.getMoviePosts(movie.id);
        console.log(`[MovieModal] ✅ Loaded ${posts.length} posts for "${movie.title}"`);
        
        if (posts.length > 0) {
          console.log(`[MovieModal] 📊 Post details:`, posts.map(p => ({
            author: p.author,
            title: p.title,
            hasSpoiler: p.hasSpoiler
          })));
        }
        
        setMoviePosts(posts);
      } catch (error) {
        console.error(`[MovieModal] ❌ Error loading posts for movie ${movie.id}:`, error);
        setError(error instanceof Error ? error.message : '리뷰를 불러올 수 없습니다');
        setMoviePosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (open && movie) {
      loadPosts();
    } else if (!open) {
      // 모달이 닫힐 때 상태 초기화
      setMoviePosts([]);
      setError(null);
      setSelectedReview(null);
      setReviewDetailModalOpen(false);
      setSpoilerConsents({});
      setSelectedAuthor(null);
    }
  }, [movie, open]);

  // 현재 사용자 정보 로드
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!currentUserId || !open) return;
      
      try {
        const user = await MovieAPI.getUserById(currentUserId);
        setCurrentUser(user);
      } catch (error) {
        console.error('[MovieModal] ❌ Error loading current user:', error);
      }
    };

    loadCurrentUser();
  }, [currentUserId, open]);

  // 실제 포스트 데이터 기반 평균 평점 계산
  const averageRating = useMemo(() => {
    if (moviePosts.length === 0) return 0;
    
    const postsWithRating = moviePosts.filter(post => post.rating !== undefined);
    if (postsWithRating.length === 0) return 0;
    
    const totalRating = postsWithRating.reduce((sum, post) => sum + (post.rating || 0), 0);
    const avg = totalRating / postsWithRating.length;
    
    console.log(`[MovieModal] 📊 Average rating for "${movie?.title}": ${avg.toFixed(2)} (${postsWithRating.length} reviews)`);
    
    return avg;
  }, [moviePosts, movie]);

  // 리뷰 재로드 핸들러
  const handleRetryLoadPosts = async () => {
    if (!movie) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`[MovieModal] 🔄 Retrying to load posts for "${movie.title}"`);
      const posts = await MovieAPI.getMoviePosts(movie.id);
      setMoviePosts(posts);
      console.log(`[MovieModal] ✅ Retry successful: ${posts.length} posts loaded`);
    } catch (error) {
      console.error(`[MovieModal] ❌ Retry failed:`, error);
      setError(error instanceof Error ? error.message : '리뷰를 불러올 수 없습니다');
      setMoviePosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 리뷰 클릭 핸들러
  const handleReviewClick = async (post: BlogPost) => {
    setSelectedReview(post);
    
    // 작성자 정보 로드
    try {
      const author = await MovieAPI.getUserById(post.authorId);
      setSelectedAuthor(author);
      
      // 댓글 로드
      const comments = await MovieAPI.getPostComments(post.id);
      setPostComments(prev => ({
        ...prev,
        [post.id]: comments
      }));
      
      setReviewDetailModalOpen(true);
    } catch (error) {
      console.error('[MovieModal] ❌ Error loading author or comments:', error);
      setReviewDetailModalOpen(true);
    }
  };

  // 스포일러 동의 핸들러
  const handleSpoilerReveal = (postId: string) => {
    setSpoilerConsents(prev => ({
      ...prev,
      [postId]: true
    }));
  };

  if (!movie) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`size-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl w-[98vw] h-[95vh] p-0 cinema-modal-glow border-2 border-primary/30 flex flex-col">
          <div className="absolute top-4 left-4 z-50">
            <DialogClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-black/80 hover:bg-black/90 backdrop-blur-sm border border-white/20"
              >
                <X className="size-4 text-white font-bold" />
              </Button>
            </DialogClose>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
            {/* 영화 포스터 */}
            <div className="relative h-64 md:h-full">
              <img
                src={movie.poster}
                alt={movie.title}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <Badge className="absolute top-4 right-4 bg-primary/90">
                {movie.platform}
              </Badge>
            </div>

            {/* 영화 정보 */}
            <div className="flex flex-col h-full overflow-hidden">
              <ScrollArea className="flex-1 h-full">
                <div className="p-4 md:p-6 space-y-6 pb-8">
                  <DialogHeader className="space-y-4">
                    <DialogTitle className="text-xl md:text-2xl pr-8">{movie.title}</DialogTitle>
                    <DialogDescription className="sr-only">
                      {movie.title} 영화의 상세 정보, 평점, 리뷰를 확인할 수 있습니다
                    </DialogDescription>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>{movie.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span>{movie.duration}분</span>
                      </div>
                      <Badge variant="secondary">{displayGenre(movie.genre)}</Badge>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        {moviePosts.length === 0 ? (
                          renderStars(0)
                        ) : (
                          renderStars(Math.round(averageRating))
                        )}
                      </div>
                      <span className="text-lg">
                        {moviePosts.length === 0 ? '0.0' : averageRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({moviePosts.length.toLocaleString()}개 리뷰)
                      </span>
                    </div>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">줄거리</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base break-words overflow-wrap-anywhere">{movie.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="min-w-16 font-medium flex-shrink-0 text-sm md:text-base">감독:</span>
                        <span className="text-muted-foreground text-sm md:text-base break-words overflow-wrap-anywhere">{movie.director}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="min-w-16 font-medium flex-shrink-0 text-sm md:text-base">출연:</span>
                        <span className="text-muted-foreground text-sm md:text-base break-words overflow-wrap-anywhere">{movie.cast.join(', ')}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <h4 className="flex items-center gap-2 font-medium">
                          <MessageCircle className="size-4" />
                          리뷰 ({moviePosts.length})
                        </h4>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (onWriteReview && movie) {
                              onWriteReview(movie);
                              onOpenChange(false);
                            }
                          }}
                        >
                          리뷰 작성
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {loading ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                            <p>리뷰를 불러오는 중...</p>
                            <p className="text-xs mt-2">데이터베이스에서 리뷰 검색 중</p>
                          </div>
                        ) : error ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <AlertCircle className="size-8 mx-auto mb-2 text-destructive opacity-70" />
                            <p className="text-destructive mb-2">리뷰를 불러오는데 실패했습니다</p>
                            <p className="text-xs mb-4">{error}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleRetryLoadPosts}
                              className="gap-2"
                            >
                              <RefreshCw className="size-4" />
                              다시 시도
                            </Button>
                          </div>
                        ) : moviePosts.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <MessageCircle className="size-8 mx-auto mb-2 opacity-50" />
                            <p>아직 리뷰가 없습니다.</p>
                            <p className="text-sm">첫 번째 리뷰를 작성해보세요!</p>
                            {movie && (
                              <p className="text-xs mt-2 opacity-60">
                                영화 ID: {movie.id}
                              </p>
                            )}
                          </div>
                        ) : (
                          <>
                            {/* 리뷰 통계 요약 */}
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Star className="size-4 text-primary fill-primary" />
                                  <span className="font-medium">평균 평점</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-primary">{averageRating.toFixed(2)}</span>
                                  <span className="text-xs text-muted-foreground">/ 5.0</span>
                                </div>
                              </div>
                            </div>

                            {/* 리뷰 목록 */}
                            {moviePosts.map((post, index) => (
                              <div 
                                key={post.id} 
                                className="space-y-2 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
                                onClick={() => handleReviewClick(post)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      <User className="size-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium">{post.author}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(post.date).toLocaleDateString('ko-KR')}
                                  </span>
                                </div>
                                
                                {post.rating !== undefined && (
                                  <div className="flex items-center gap-1">
                                    {renderStars(post.rating)}
                                    <span className="text-sm text-muted-foreground ml-2">
                                      {post.rating}/5
                                    </span>
                                  </div>
                                )}

                                <h5 className="font-medium text-sm">
                                  {post.spoilerFree === false ? "⚠️ 스포일러가 포함된 리뷰입니다" : post.title}
                                </h5>
                                
                                {post.spoilerFree === false ? (
                                  <SpoilerContent 
                                    content={post.content} 
                                    isBlurred={!spoilerConsents[post.id]} 
                                    limitHeight={true}
                                    onReveal={() => handleSpoilerReveal(post.id)}
                                  />
                                ) : (
                                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                    {post.content}
                                  </p>
                                )}
                                
                                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                                  <div className="flex items-center gap-1">
                                    <Heart className="size-3" />
                                    <span>{post.likes}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="size-3" />
                                    <span>{post.comments}</span>
                                  </div>
                                </div>
                                
                                {index < moviePosts.length - 1 && (
                                  <Separator className="mt-4" />
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 리뷰 상세 모달 */}
      {selectedReview && selectedAuthor && currentUser && (
        <PostDetailModal
          post={selectedReview}
          author={selectedAuthor}
          currentUser={currentUser}
          comments={postComments[selectedReview.id] || []}
          open={reviewDetailModalOpen}
          onOpenChange={(open) => {
            setReviewDetailModalOpen(open);
            if (!open) {
              setSelectedReview(null);
              setSelectedAuthor(null);
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
          isFollowing={selectedReview ? followingIds.includes(selectedReview.authorId) : false}
          scrollToComments={scrollToComments}
          spoilerConsent={spoilerConsents[selectedReview.id] || false}
          onSpoilerConsent={(postId) => handleSpoilerReveal(postId)}
        />
      )}

      {/* 공유 모달 */}
      <ShareModal
        post={sharePost}
        open={!!sharePost}
        onOpenChange={(open) => !open && setSharePost(null)}
      />
    </>
  );
}
