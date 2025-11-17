import { useState, useEffect, useMemo } from 'react';
import { Movie, Review } from '../types/movie';
import { MovieAPI } from '../utils/movieApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Star, Clock, Calendar, User, ThumbsUp, Play, X, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { DialogClose } from './ui/dialog';
import { displayGenre } from '../utils/genreHelper';

interface MovieModalProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWriteReview?: (movie: Movie) => void;
}

export function MovieModal({ movie, open, onOpenChange, onWriteReview }: MovieModalProps) {
  const [movieReviews, setMovieReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 영화 리뷰 로드
  useEffect(() => {
    const loadReviews = async () => {
      if (!movie) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`[MovieModal] 📽️ Loading reviews for movie "${movie.title}" (ID: ${movie.id})`);
        const reviews = await MovieAPI.getMovieReviews(movie.id);
        console.log(`[MovieModal] ✅ Loaded ${reviews.length} reviews for "${movie.title}"`);
        
        if (reviews.length > 0) {
          console.log(`[MovieModal] 📊 Review details:`, reviews.map(r => ({
            author: r.author,
            rating: r.rating,
            date: r.date
          })));
        }
        
        setMovieReviews(reviews);
      } catch (error) {
        console.error(`[MovieModal] ❌ Error loading reviews for movie ${movie.id}:`, error);
        setError(error instanceof Error ? error.message : '리뷰를 불러올 수 없습니다');
        setMovieReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (open && movie) {
      loadReviews();
    } else if (!open) {
      // 모달이 닫힐 때 상태 초기화
      setMovieReviews([]);
      setError(null);
    }
  }, [movie, open]);

  // 실제 리뷰 데이터 기반 평균 평점 계산
  const averageRating = useMemo(() => {
    if (movieReviews.length === 0) return 0;
    
    const totalRating = movieReviews.reduce((sum, review) => sum + review.rating, 0);
    const avg = totalRating / movieReviews.length;
    
    console.log(`[MovieModal] 📊 Average rating for "${movie?.title}": ${avg.toFixed(2)} (${movieReviews.length} reviews)`);
    
    return avg;
  }, [movieReviews, movie]);

  // 리뷰 재로드 핸들러
  const handleRetryLoadReviews = async () => {
    if (!movie) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`[MovieModal] 🔄 Retrying to load reviews for "${movie.title}"`);
      const reviews = await MovieAPI.getMovieReviews(movie.id);
      setMovieReviews(reviews);
      console.log(`[MovieModal] ✅ Retry successful: ${reviews.length} reviews loaded`);
    } catch (error) {
      console.error(`[MovieModal] ❌ Retry failed:`, error);
      setError(error instanceof Error ? error.message : '리뷰를 불러올 수 없습니다');
      setMovieReviews([]);
    } finally {
      setLoading(false);
    }
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
                      {movieReviews.length === 0 ? (
                        renderStars(0) // 리뷰가 0개이면 빈 별들
                      ) : (
                        renderStars(Math.round(averageRating))
                      )}
                    </div>
                    <span className="text-lg">
                      {movieReviews.length === 0 ? '0.0' : averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({movieReviews.length.toLocaleString()}개 리뷰)
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
                        리뷰 ({movieReviews.length})
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
                            onClick={handleRetryLoadReviews}
                            className="gap-2"
                          >
                            <RefreshCw className="size-4" />
                            다시 시도
                          </Button>
                        </div>
                      ) : movieReviews.length === 0 ? (
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
                          {movieReviews.map((review, index) => (
                            <div key={review.id} className="space-y-2 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="size-4 text-primary" />
                                  </div>
                                  <span className="text-sm font-medium">{review.author}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString('ko-KR')}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-muted-foreground ml-2">
                                  {review.rating}/5
                                </span>
                              </div>
                              
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {review.comment}
                              </p>
                              
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <ThumbsUp className="size-3" />
                                <span>도움됨 {review.helpful}</span>
                              </div>
                              
                              {index < movieReviews.length - 1 && (
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
  );
}
