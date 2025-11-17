import { useState, useEffect, useRef } from 'react';
import { BlogPost, UserProfile, Comment } from '../types/movie';
import { MovieAPI } from '../utils/movieApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
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
  Eye,
  Bookmark,
  Send,
  Reply,
  Clock
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  parentId?: string;
}

interface PostDetailModalProps {
  post: BlogPost | null;
  author: UserProfile | null;
  currentUser: UserProfile | null;
  comments: Comment[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLikeToggle?: (postId: string) => void;
  onFollowToggle?: (userId: string) => void;
  onSharePost?: (post: BlogPost) => void;
  onUserProfileClick?: (userId: string) => void;
  onAddComment?: (postId: string, content: string) => void;
  onAddReply?: (postId: string, parentId: string, content: string) => void;
  onCommentLikeToggle?: (postId: string, commentId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onEditPost?: (post: BlogPost) => void;
  onDeletePost?: (postId: string) => void;
  isFollowing?: boolean;
  scrollToComments?: boolean;
  spoilerConsent?: boolean;
  onSpoilerConsent?: (postId: string) => void;
}

export function PostDetailModal({
  post,
  author,
  currentUser,
  comments,
  open,
  onOpenChange,
  onLikeToggle,
  onFollowToggle,
  onSharePost,
  onUserProfileClick,
  onAddComment,
  onAddReply,
  onCommentLikeToggle,
  onDeleteComment,
  onEditPost,
  onDeletePost,
  isFollowing = false,
  scrollToComments = false,
  spoilerConsent = false,
  onSpoilerConsent
}: PostDetailModalProps) {
  const [newComment, setNewComment] = useState('');
  const [hiddenComments, setHiddenComments] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const commentsRef = useRef<HTMLDivElement>(null);

  // 댓글 로드 - 실제 데이터베이스 댓글만 사용
  useEffect(() => {
    const loadComments = async () => {
      if (!post || !open) return;
      
      setLoadingComments(true);
      try {
        console.log(`[PostDetailModal] 📝 Loading comments for post ${post.id}`);
        const dbComments = await MovieAPI.getPostComments(post.id);
        console.log(`[PostDetailModal] ✅ Loaded ${dbComments.length} comments from database`);
        setLocalComments(dbComments);
      } catch (error) {
        console.error('[PostDetailModal] ❌ Error loading comments:', error);
        // 에러 시에도 빈 배열로 초기화 (더미 데이터 사용하지 않음)
        setLocalComments([]);
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [post?.id, open]);

  // 폼 초기화
  useEffect(() => {
    if (post) {
      setNewComment('');
      setReplyingTo(null);
      setReplyContent('');
    }
  }, [post?.id]);

  // 댓글에서 특정 사용자 정보 업데이트하는 헬퍼 함수 (PostDetailModal용)
  const updateCommentsUserInfo = (comments: Comment[], userId: string, updatedUser: UserProfile): Comment[] => {
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
  };

  // 댓글 섹션으로 스크롤
  useEffect(() => {
    if (open && scrollToComments && commentsRef.current) {
      const timer = setTimeout(() => {
        // ScrollArea viewport를 찾아서 스크롤
        const scrollViewport = document.querySelector('[data-radix-scroll-area-viewport]');
        const commentsElement = commentsRef.current;
        
        if (scrollViewport && commentsElement) {
          // 댓글 섹션의 상대적 위치 계산
          const elementRect = commentsElement.getBoundingClientRect();
          const viewportRect = scrollViewport.getBoundingClientRect();
          const targetScrollTop = scrollViewport.scrollTop + elementRect.top - viewportRect.top - 100;
          
          scrollViewport.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
        }
      }, 300); // 모달이 완전히 열린 후 스크롤
      return () => clearTimeout(timer);
    }
  }, [open, scrollToComments]);

  if (!post || !author || !currentUser) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`size-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRecommendationConfig = (recommendation?: string) => {
    switch (recommendation) {
      case 'highly_recommended':
        return { 
          icon: ThumbsUp, 
          label: '강력 추천', 
          color: 'bg-green-500' 
        };
      case 'recommended':
        return { 
          icon: Target, 
          label: '추천', 
          color: 'bg-blue-500' 
        };
      case 'neutral':
        return { 
          icon: Shield, 
          label: '보통', 
          color: 'bg-yellow-500' 
        };
      case 'not_recommended':
        return { 
          icon: ThumbsDown, 
          label: '비추천', 
          color: 'bg-red-500' 
        };
      default:
        return { 
          icon: Target, 
          label: '추천', 
          color: 'bg-blue-500' 
        };
    }
  };

  const { icon: RecIcon, label, color } = getRecommendationConfig(post.recommendation);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return '방금 전';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !post) return;
    
    // App.tsx의 핸들러 호출 (DB에 저장)
    onAddComment?.(post.id, newComment);
    setNewComment('');
    
    // 댓글 추가 후 다시 로드
    setTimeout(async () => {
      try {
        const updatedComments = await MovieAPI.getPostComments(post.id);
        setLocalComments(updatedComments);
      } catch (error) {
        console.error('Error reloading comments:', error);
      }
    }, 500);
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim() || !post) return;
    
    // App.tsx의 핸들러 호출 (DB에 저장)
    onAddReply?.(post.id, parentId, replyContent);
    setReplyContent('');
    setReplyingTo(null);
    
    // 답글 추가 후 다시 로드
    setTimeout(async () => {
      try {
        const updatedComments = await MovieAPI.getPostComments(post.id);
        setLocalComments(updatedComments);
      } catch (error) {
        console.error('Error reloading comments:', error);
      }
    }, 500);
  };

  const handleLikeComment = async (commentId: string) => {
    if (!post) return;
    
    // 실제 댓글 좋아요 토글 (데이터베이스에 저장)
    if (onCommentLikeToggle) {
      onCommentLikeToggle(post.id, commentId);
      
      // 댓글 좋아요 후 다시 로드
      setTimeout(async () => {
        try {
          const updatedComments = await MovieAPI.getPostComments(post.id);
          setLocalComments(updatedComments);
        } catch (error) {
          console.error('Error reloading comments after like:', error);
        }
      }, 300);
    }
  };

  const handleHideComment = (commentId: string) => {
    setHiddenComments(prev => new Set([...prev, commentId]));
  };

  const handleReportComment = (commentId: string) => {
    // 신고 기능 구현 (여기서는 콘솔에 로그만 남김)
    console.log('댓글 신고:', commentId);
    // 실제로는 서버에 신고 요청을 보낼 것
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!post) return;
    
    // 실제 댓글 삭제 (데이터베이스에서 삭제)
    if (onDeleteComment) {
      onDeleteComment(post.id, commentId);
      
      // 댓글 삭제 후 다시 로드
      setTimeout(async () => {
        try {
          const updatedComments = await MovieAPI.getPostComments(post.id);
          setLocalComments(updatedComments);
        } catch (error) {
          console.error('Error reloading comments after delete:', error);
        }
      }, 300);
    }
  };

  // 전체 댓글 수 계산 (답글 포함)
  const countAllComments = (comments: Comment[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? countAllComments(comment.replies) : 0);
    }, 0);
  };

  // 댓글 렌더링 함수
  const renderComment = (comment: Comment, depth: number = 0) => {
    if (hiddenComments.has(comment.id)) return null;

    return (
      <div key={comment.id} className={`space-y-3 ${depth > 0 ? 'ml-12' : ''}`}>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
          <Avatar 
            className={`${depth === 0 ? 'size-12' : 'size-10'} ring-2 ring-primary/10 cursor-pointer hover:ring-primary/30 transition-all`}
            onClick={() => onUserProfileClick?.(comment.authorId)}
          >
            <AvatarImage src={comment.authorAvatar} />
            <AvatarFallback>{comment.author[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                className={`${depth === 0 ? 'font-medium' : 'font-medium text-sm'} cursor-pointer hover:text-primary transition-colors`}
                onClick={() => onUserProfileClick?.(comment.authorId)}
              >
                {comment.author}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className={`${depth === 0 ? 'size-3' : 'size-2.5'}`} />
                <span>{formatDateTime(comment.date)}</span>
              </div>
            </div>
            
            <p className={`${depth === 0 ? 'text-sm' : 'text-sm'} leading-relaxed break-words overflow-wrap-anywhere`}>
              {comment.content}
            </p>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeComment(comment.id)}
                className={`gap-1 text-xs ${depth === 0 ? 'h-8' : 'h-7'} hover:bg-red-500/10 transition-colors ${
                  comment.isLiked ? 'text-red-500' : 'text-muted-foreground'
                }`}
              >
                <Heart className={`${depth === 0 ? 'size-3' : 'size-2.5'} transition-all ${
                  comment.isLiked ? 'fill-current scale-110' : ''
                }`} />
                <span>{comment.likes > 0 ? comment.likes : ''}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className={`gap-1 text-xs ${depth === 0 ? 'h-8' : 'h-7'} text-muted-foreground hover:bg-primary/10`}
              >
                <Reply className={`${depth === 0 ? 'size-3' : 'size-2.5'}`} />
                답글
              </Button>
              
              <MoreOptionsMenu 
                className="text-muted-foreground text-xs"
                onHide={() => handleHideComment(comment.id)}
                onReport={() => handleReportComment(comment.id)}
                onDelete={() => handleDeleteComment(comment.id)}
                showDelete={comment.authorId === currentUser?.id}  // 본인 댓글만 삭제 가능
              />
            </div>
          </div>
        </div>

        {/* 답글 작성 영역 */}
        {replyingTo === comment.id && (
          <div className={`${depth > 0 ? 'ml-8' : 'ml-12'} bg-muted/20 rounded-lg p-3`}>
            <div className="flex items-start gap-3">
              <Avatar className="size-8 ring-1 ring-primary/20">
                <AvatarImage src={currentUser?.avatar} />
                <AvatarFallback>{currentUser?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder={`${comment.author}님에게 답글...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-20 resize-none text-sm border-primary/20 focus:border-primary/40"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    className="text-xs"
                  >
                    취소
                  </Button>
                  <Button 
                    onClick={() => handleAddReply(comment.id)}
                    disabled={!replyContent.trim()}
                    size="sm"
                    className="gap-2 text-xs bg-primary hover:bg-primary/90"
                  >
                    <Send className="size-3" />
                    답글 작성
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 답글 목록 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-3">
            {comment.replies
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())  // 답글도 오래된 순으로 정렬
              .map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // 숨겨지지 않은 댓글만 필터링하고 날짜순으로 정렬 (오래된 순)
  // 실제 데이터베이스 댓글만 사용 (더미 댓글 제거됨)
  const allComments = localComments
    .filter(comment => !hiddenComments.has(comment.id))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const totalCommentCount = countAllComments(allComments);

  // 스포일러가 있는데 동의하지 않은 경우
  const hasSpoiler = post?.spoilerFree === false;
  const needsConsent = hasSpoiler && !spoilerConsent;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[98vw] h-[95vh] p-0 cinema-modal-glow border-2 border-primary/30 flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>게시글 상세 보기</DialogTitle>
          <DialogDescription>게시글의 전체 내용을 확인하고 상호작용할 수 있습니다</DialogDescription>
        </DialogHeader>
        
        {/* 고정 헤더 */}
        <div className="flex-shrink-0 p-4 md:p-6 pb-4 pr-16 border-b bg-background/95 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <Avatar 
              className="size-12 ring-2 ring-primary/30 flex-shrink-0 cursor-pointer hover:ring-primary/50 transition-all"
              onClick={() => onUserProfileClick?.(author.id)}
            >
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 
                  className="font-medium truncate cursor-pointer hover:text-primary transition-colors"
                  onClick={() => onUserProfileClick?.(author.id)}
                >
                  {author.name}
                </h4>
                {author.verified && (
                  <VerificationBadge level={author.verified} size="sm" />
                )}
              </div>
              
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Calendar className="size-3.5" />
                  <span>{formatDate(post.date)}</span>
                </div>
                {post.spoilerFree && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 flex-shrink-0">
                    <Shield className="size-3 text-green-500" />
                    <span className="text-green-500 font-medium text-xs">스포일러 프리</span>
                  </div>
                )}
              </div>
              
              {/* 팔로우 버튼과 더보기 메뉴를 사용자 정보 아래로 이동 */}
              <div className="flex items-center gap-2">
                {author.id !== currentUser?.id && (
                  <Button
                    variant={isFollowing ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => onFollowToggle?.(author.id)}
                    className="gap-1"
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="size-4" />
                        <span className="hidden sm:inline">언팔로우</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="size-4" />
                        <span className="hidden sm:inline">팔로우</span>
                      </>
                    )}
                  </Button>
                )}
                <MoreOptionsMenu 
                  isOwnContent={post.authorId === currentUser?.id}
                  onEdit={onEditPost ? () => {
                    onEditPost(post);
                    onOpenChange(false);
                  } : undefined}
                  onDelete={onDeletePost ? () => {
                    onDeletePost(post.id);
                    onOpenChange(false);
                  } : undefined}
                  onHide={() => {
                    console.log('포스트 숨기기:', post.id);
                    onOpenChange(false);
                  }}
                  onBlock={() => {
                    console.log('사용자 차단:', author.id);
                    onOpenChange(false);
                  }}
                  onReport={() => {
                    console.log('포스트 신고:', post.id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 md:px-6">
            {needsConsent ? (
              // 스포일러 동의 필요 화면
              <div className="flex items-center justify-center min-h-full p-6">
                <div className="w-full max-w-md mx-auto text-center space-y-6">
                  <div className="relative">
                    <div className="size-24 mx-auto rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mb-4">
                      <Shield className="size-12 text-destructive animate-pulse" />
                    </div>
                    <div className="absolute inset-0 size-24 mx-auto rounded-full bg-destructive/20 blur-xl -z-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-xl">⚠️ 스포일러 포함 리뷰</h2>
                    <div className="w-16 h-0.5 bg-destructive/50 mx-auto rounded-full" />
                  </div>
                  
                  <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-4 text-sm leading-relaxed">
                    이 리뷰에는 영화의 핵심 스토리와 결말이 포함되어 있습니다.<br />
                    영화를 아직 감상하지 않으셨다면 신중히 선택해주세요.
                  </div>
                  
                  <div className="flex flex-col gap-3 pt-2">
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        if (onSpoilerConsent && post) {
                          onSpoilerConsent(post.id);
                        }
                      }}
                      className="gap-2 w-full shadow-lg"
                      size="lg"
                    >
                      <Eye className="size-5" />
                      스포일러 보기
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => onOpenChange(false)}
                      className="gap-2 w-full border-muted-foreground/30 hover:bg-muted/50"
                      size="lg"
                    >
                      <Shield className="size-5" />
                      안전하게 나가기
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-6">
              {/* 영화 정보 섹션 */}
              {post.movieTitle && (
                <div className="flex gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border-2 border-primary/20">
                  {/* 영화 포스터 */}
                  {post.moviePoster && (
                    <div className="shrink-0">
                      <div className="relative aspect-[2/3] w-20 sm:w-28 md:w-32 rounded-lg overflow-hidden ring-2 ring-primary/30 shadow-lg">
                        <img 
                          src={post.moviePoster} 
                          alt={post.movieTitle}
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* 영화 정보 */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-2 sm:gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">리뷰한 영화</div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground line-clamp-2 break-words overflow-wrap-anywhere">
                        {post.movieTitle}
                      </h2>
                    </div>
                    {post.platform && (
                      <Badge variant="secondary" className="w-fit px-3 py-1">
                        {post.platform}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* 제목과 평점 */}
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight break-words overflow-wrap-anywhere">{post.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(post.rating)}
                    </div>
                    <span className="text-lg md:text-xl font-medium text-primary">{post.rating}.0</span>
                  </div>
                  
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm ${color}`}>
                    <RecIcon className="size-4" />
                    {label}
                  </div>
                </div>

                {post.summary && (
                  <blockquote className="border-l-4 border-primary/50 bg-muted/30 p-4 rounded-r-lg mb-4">
                    <p className="italic text-base sm:text-lg break-words overflow-wrap-anywhere">"{post.summary}"</p>
                  </blockquote>
                )}
              </div>

              {/* 리뷰 내용 */}
              <div>
                {hasSpoiler && spoilerConsent ? (
                  // 스포일러가 있고 동의한 경우 - 바로 표시
                  <div className="prose prose-lg max-w-none dark:prose-invert break-words overflow-wrap-anywhere">
                    <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
                  </div>
                ) : !hasSpoiler ? (
                  // 스포일러 없는 경우 - 바로 표시
                  <div className="prose prose-lg max-w-none dark:prose-invert break-words overflow-wrap-anywhere">
                    <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
                  </div>
                ) : null}
              </div>

              {/* 장단점 - 스포일러가 없거나 동의한 경우에만 표시 */}
              {(!hasSpoiler || spoilerConsent) && (post.pros?.length || post.cons?.length) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {post.pros && post.pros.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-green-500 flex items-center gap-2">
                        <ThumbsUp className="size-5" />
                        좋았던 점
                      </h3>
                      <ul className="space-y-2">
                        {post.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-1 shrink-0">•</span>
                            <span className="break-words overflow-wrap-anywhere">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {post.cons && post.cons.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-red-500 flex items-center gap-2">
                        <ThumbsDown className="size-5" />
                        아쉬운 점
                      </h3>
                      <ul className="space-y-2">
                        {post.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-red-500 mt-1 shrink-0">•</span>
                            <span className="break-words overflow-wrap-anywhere">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 태그 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* 액션 버튼들 */}
              <div className="bg-background/95 backdrop-blur-sm border border-primary/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                    <Button
                      variant="ghost"
                      onClick={() => onLikeToggle?.(post.id)}
                      className={`gap-1 md:gap-2 hover:bg-red-500/10 ${post.isLiked ? 'text-red-500' : ''}`}
                      size="sm"
                    >
                      <Heart className={`size-4 md:size-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm md:text-base">{post.likes}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 md:gap-2 hover:bg-primary/10"
                      onClick={() => {
                        const commentsElement = commentsRef.current;
                        if (commentsElement) {
                          // ScrollArea viewport 찾기
                          const scrollViewport = document.querySelector('[data-radix-scroll-area-viewport]');
                          if (scrollViewport) {
                            const elementRect = commentsElement.getBoundingClientRect();
                            const viewportRect = scrollViewport.getBoundingClientRect();
                            const scrollTop = scrollViewport.scrollTop + elementRect.top - viewportRect.top - 100;
                            
                            scrollViewport.scrollTo({
                              top: scrollTop,
                              behavior: 'smooth'
                            });
                          }
                        }
                      }}
                    >
                      <MessageCircle className="size-4 md:size-5" />
                      <span className="text-sm md:text-base">댓글 {totalCommentCount}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSharePost?.(post)}
                      className="gap-1 md:gap-2 hover:bg-primary/10"
                    >
                      <Share className="size-4 md:size-5" />
                      <span className="text-sm md:text-base hidden sm:inline">공유</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 hover:bg-primary/10"
                    >
                      <Bookmark className="size-4" />
                      <span className="hidden md:inline">저장</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* 댓글 섹션 */}
              <div ref={commentsRef} className="space-y-6">
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MessageCircle className="size-5 text-primary" />
                    댓글 {totalCommentCount}개
                  </h3>
                  
                  {/* 메인 댓글 작성 영역 - currentUser의 최신 정보를 사용하도록 수정 */}
                  <div className="bg-muted/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-12 ring-2 ring-primary/20">
                        <AvatarImage src={currentUser?.avatar} key={currentUser?.avatar || 'default'} />
                        <AvatarFallback>{currentUser?.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <Textarea
                          placeholder="댓글을 작성해주세요..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-24 resize-none border-primary/20 focus:border-primary/40"
                        />
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="gap-2 bg-primary hover:bg-primary/90"
                          >
                            <Send className="size-4" />
                            댓글 작성
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 댓글 목록 */}
                  <div className="space-y-4">
                    {loadingComments ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>댓글을 불러오는 중...</p>
                      </div>
                    ) : allComments.length > 0 ? (
                      allComments.map((comment) => renderComment(comment))
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageCircle className="size-12 mx-auto mb-4 opacity-50" />
                        <p>첫 번째 댓글을 작성해보세요!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}