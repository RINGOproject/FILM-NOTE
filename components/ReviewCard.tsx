import { BlogPost, UserProfile } from '../types/movie';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { VerificationBadge } from './VerificationBadge';
import { SpoilerContent } from './SpoilerContent';
import { MoreOptionsMenu } from './MoreOptionsMenu';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Star, 
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Target,
  Shield,
  UserPlus,
  UserMinus,
  Ban
} from 'lucide-react';

interface ReviewCardProps {
  post: BlogPost;
  author?: UserProfile;
  currentUser: UserProfile;
  isFollowing: boolean;
  variant?: {
    state?: 'default' | 'spoiler' | 'blocked' | 'private' | 'loading';
    rating?: 1 | 2 | 3 | 4 | 5;
    userType?: 'follower' | 'anonymous';
  };
  onFollowToggle?: (userId: string) => void;
  onLikeToggle?: (postId: string) => void;
  onSharePost?: (post: BlogPost) => void;
  onUserProfileClick?: (userId: string) => void;
  onCommentClick?: (post: BlogPost) => void;
  onSpoilerConsent?: (postId: string) => void;
  onHidePost?: (postId: string) => void;
  onBlockUser?: (userId: string) => void;
  onReportPost?: (postId: string) => void;
  onEditPost?: (post: BlogPost) => void;
  onDeletePost?: (postId: string) => void;
}

export function ReviewCard({ 
  post, 
  author, 
  currentUser,
  isFollowing,
  variant = {},
  onSpoilerConsent,
  onFollowToggle,
  onLikeToggle,
  onSharePost,
  onUserProfileClick,
  onCommentClick,
  onHidePost,
  onBlockUser,
  onReportPost,
  onEditPost,
  onDeletePost
}: ReviewCardProps) {
  const {
    state = 'default',
    rating,
    userType = 'follower'
  } = variant;

  const displayRating = rating || post.rating;

  const renderStars = (ratingValue: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`size-4 ${ 
          i < ratingValue ? 'fill-primary text-primary' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation) {
      case 'highly_recommended':
        return { color: 'bg-green-500', label: '강력 추천', icon: ThumbsUp };
      case 'recommended':
        return { color: 'bg-blue-500', label: '추천', icon: Target };
      case 'neutral':
        return { color: 'bg-yellow-500', label: '보통', icon: Target };
      case 'not_recommended':
        return { color: 'bg-red-500', label: '비추천', icon: ThumbsDown };
      default:
        return { color: 'bg-gray-500', label: '보통', icon: Target };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '어제';
    if (diffDays <= 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const { color, label, icon: RecIcon } = getRecommendationStyle(post.recommendation || 'neutral');

  // Loading 상태
  if (state === 'loading') {
    return (
      <Card className="cinema-glow">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-0.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  // Blocked 상태
  if (state === 'blocked') {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Ban className="size-12 mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground">차단된 사용자입니다</p>
          </div>
        </div>
        <CardHeader className="pb-4 opacity-30">
          <div className="flex items-center gap-2">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-0.5">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="opacity-30">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Private 상태
  if (state === 'private') {
    return (
      <Card className="relative overflow-hidden opacity-50">
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="bg-muted/80 backdrop-blur-sm">
            비공개 리뷰입니다
          </Badge>
        </div>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Avatar className="size-10">
              <AvatarImage src={author?.avatar} alt={post.author} />
              <AvatarFallback>{post.author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm">{post.author}</h4>
              <p className="text-xs text-muted-foreground">{formatDate(post.date)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-20 flex items-center justify-center text-muted-foreground text-sm">
            이 리뷰는 비공개로 설정되어 있어요
          </div>
        </CardContent>
      </Card>
    );
  }

  // Spoiler 또는 Default 상태
  return (
    <Card 
      className="cinema-glow hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onCommentClick?.(post)}
    >
      <CardHeader className="pb-4">
        {/* 작성자 정보 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Avatar 
              className="size-10 ring-2 ring-primary/20 cursor-pointer hover:ring-primary/40 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onUserProfileClick?.(post.authorId);
              }}
            >
              <AvatarImage src={author?.avatar} alt={post.author} />
              <AvatarFallback>{post.author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm">{post.author}</h4>
                {author?.verified && (
                  <VerificationBadge level={author.verified} size="sm" />
                )}
                {isFollowing && userType === 'follower' && (
                  <Badge variant="secondary" className="text-xs px-2">
                    팔로잉
                  </Badge>
                )}
              </div>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>{formatDate(post.date)}</span>
                </div>
                {post.spoilerFree && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <Shield className="size-3 text-green-500" />
                    <span className="text-green-500 text-xs">스포일러 프리</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {author?.id !== currentUser.id && (
              <Button
                variant={isFollowing ? "secondary" : "outline"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onFollowToggle?.(post.authorId);
                }}
                className="gap-1 text-xs h-8 px-3"
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="size-3" />
                    <span className="hidden sm:inline">언팔로우</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="size-3" />
                    <span className="hidden sm:inline">팔로우</span>
                  </>
                )}
              </Button>
            )}
            <MoreOptionsMenu 
              isOwnContent={author?.id === currentUser.id}
              onEdit={author?.id === currentUser.id ? () => onEditPost?.(post) : undefined}
              onDelete={author?.id === currentUser.id ? () => onDeletePost?.(post.id) : undefined}
              onHide={() => onHidePost?.(post.id)}
              onBlock={() => onBlockUser?.(post.authorId)}
              onReport={() => onReportPost?.(post.id)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 영화 정보 섹션 - 필수 표시 */}
        {post.movieTitle && (
          <div className="flex gap-3 sm:gap-4 p-3 rounded-lg bg-muted/30 border border-primary/10">
            {/* 영화 포스터 썸네일 */}
            {post.moviePoster && (
              <div className="shrink-0">
                <div className="relative aspect-[2/3] w-14 sm:w-16 rounded overflow-hidden ring-2 ring-primary/20">
                  <img 
                    src={post.moviePoster} 
                    alt={post.movieTitle}
                    className="size-full object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* 영화 제목 및 플랫폼 */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
              <h3 className="text-sm sm:text-base font-medium text-foreground line-clamp-2 break-words">
                {post.movieTitle}
              </h3>
              {post.platform && (
                <Badge variant="secondary" className="w-fit text-xs px-2 py-0.5">
                  {post.platform}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Spoiler 상태 처리 */}
        {state === 'spoiler' || post.spoilerFree === false ? (
          <div className="space-y-4">
            {/* 평점 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(displayRating)}
              </div>
              <span className="text-base">{displayRating}.0</span>
            </div>
            
            {/* 스포일러 블러 처리 */}
            <SpoilerContent
              content={post.content}
              pros={post.pros}
              cons={post.cons}
              isBlurred={true}
              showWarningOverlay={false}
              onReveal={() => onSpoilerConsent?.(post.id)}
            >
              <div className="space-y-3">
                <h2 className="text-base sm:text-lg line-clamp-2 break-words">{post.title}</h2>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs ${color}`}>
                    <RecIcon className="size-3" />
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                </div>

                {post.summary && (
                  <p className="text-muted-foreground italic text-sm line-clamp-3 break-words overflow-wrap-anywhere">
                    "{post.summary}"
                  </p>
                )}
              </div>
            </SpoilerContent>
          </div>
        ) : (
          // Default 상태 - 일반 리뷰
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg line-clamp-2 break-words">{post.title}</h2>
            
            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(displayRating)}
                </div>
                <span className="text-base">{displayRating}.0</span>
              </div>
              
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs ${color}`}>
                <RecIcon className="size-3" />
                <span className="hidden sm:inline">{label}</span>
              </div>
            </div>

            {post.summary && (
              <p className="text-muted-foreground italic text-sm line-clamp-3 break-words overflow-wrap-anywhere">
                "{post.summary}"
              </p>
            )}
          </div>
        )}

        <Separator className="my-3" />

        {/* 버튼 그룹 */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle?.(post.id);
            }}
            className={`gap-2 p-2 h-auto ${post.isLiked ? 'text-red-500' : ''}`}
          >
            <Heart className={`size-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{post.likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onCommentClick?.(post);
            }}
            className="gap-2 p-2 h-auto"
          >
            <MessageCircle className="size-4" />
            <span className="text-sm">{post.comments || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSharePost?.(post);
            }}
            className="gap-2 p-2 h-auto"
          >
            <Share className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Separator } from './ui/separator';
