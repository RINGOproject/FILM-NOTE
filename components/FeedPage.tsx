import { useState, useRef } from 'react';
import { BlogPost, UserProfile } from '../types/movie';
import { ReviewCard } from './ReviewCard';
import { FeedFilterTabs } from './FeedFilterTabs';
import { FeedEmptyState } from './FeedEmptyState';
import { FeedLoadingState } from './FeedLoadingState';
import { PostDetailModal } from './PostDetailModal';
import { toast } from 'sonner';
import { 
  Popcorn,
  RefreshCw
} from 'lucide-react';

// 댓글 타입 정의
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

interface FeedPageProps {
  posts: BlogPost[];
  users: UserProfile[];
  currentUser: UserProfile;
  postComments: Record<string, Comment[]>;
  onFollowToggle?: (userId: string) => void;
  onLikeToggle?: (postId: string) => void;
  onUserProfileClick?: (userId: string) => void;
  onAddComment?: (postId: string, content: string) => void;
  onAddReply?: (postId: string, parentId: string, content: string) => void;
  onCommentLikeToggle?: (postId: string, commentId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onEditPost?: (post: BlogPost) => void;
  onDeletePost?: (postId: string) => void;
  followingIds?: string[];
  loading?: boolean;
  onRefresh?: () => Promise<void>;
}

export function FeedPage({ 
  posts, 
  users, 
  currentUser, 
  postComments, 
  onFollowToggle, 
  onLikeToggle, 
  onUserProfileClick, 
  onAddComment,
  onAddReply,
  onCommentLikeToggle,
  onDeleteComment,
  onEditPost,
  onDeletePost,
  followingIds = [],
  loading = false,
  onRefresh
}: FeedPageProps) {
  const [activeTab, setActiveTab] = useState<'following' | 'all'>('following');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [scrollToComments, setScrollToComments] = useState(false);
  const [hiddenPosts, setHiddenPosts] = useState<Set<string>>(new Set());
  const [spoilerConsent, setSpoilerConsent] = useState<Record<string, boolean>>({});
  
  // Pull-to-refresh state
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop === 0 && touchStartY.current > 0) {
      const touchY = e.touches[0].clientY;
      const distance = touchY - touchStartY.current;
      
      if (distance > 0) {
        setIsPulling(true);
        setPullDistance(Math.min(distance * 0.5, 120));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 80 && onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
        toast.success('피드를 새로고침했어요');
      } catch (error) {
        console.error('Error refreshing feed:', error);
        toast.error('새로고침에 실패했어요');
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
    touchStartY.current = 0;
  };

  // 사용자 프로필 클릭 핸들러 (모달 닫기 포함)
  const handleUserProfileClickWithModalClose = (userId: string) => {
    setSelectedPost(null);
    setScrollToComments(false);
    onUserProfileClick?.(userId);
  };

  const getUserById = (userId: string) => users.find(u => u.id === userId);

  const filteredPosts = activeTab === 'following' 
    ? posts.filter(post => followingIds.includes(post.authorId))
    : posts;

  const sortedPosts = [...filteredPosts]
    .filter(post => !hiddenPosts.has(post.id))
    .sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  const handleHidePost = (postId: string) => {
    setHiddenPosts(prev => new Set([...prev, postId]));
    toast.success('게시글을 숨겼어요');
  };

  const handleBlockUser = (userId: string) => {
    const blockedUserPosts = posts.filter(post => post.authorId === userId);
    blockedUserPosts.forEach(post => {
      setHiddenPosts(prev => new Set([...prev, post.id]));
    });
    toast.success('사용자를 차단했어요');
  };

  const handleReportPost = (postId: string) => {
    console.log('포스트 신고:', postId);
    toast.success('신고가 접수되었어요');
  };

  const copyToClipboardFallback = (text: string): boolean => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (err) {
      document.body.removeChild(textarea);
      return false;
    }
  };

  const handleSharePost = async (post: BlogPost) => {
    const shareUrl = window.location.href + '#post-' + post.id;
    const shareText = post.summary || '영화 리뷰';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: shareUrl
        });
        toast.success('공유했어요');
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.log('Web Share API not available, using fallback');
      }
    }
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('링크를 복사했어요');
        return;
      }
    } catch (error) {
      console.log('Clipboard API blocked, using fallback method');
    }
    
    const success = copyToClipboardFallback(shareUrl);
    if (success) {
      toast.success('링크를 복사했어요');
    } else {
      toast.info('링크를 복사해주세요');
      setTimeout(() => {
        prompt('이 링크를 복사하세요', shareUrl);
      }, 100);
    }
  };

  return (
    <div 
      className="max-w-4xl mx-auto relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={scrollContainerRef}
    >
      {/* Pull-to-refresh indicator */}
      {(isPulling || isRefreshing) && (
        <div 
          className="fixed top-16 left-0 right-0 z-50 flex justify-center"
          style={{
            transform: `translateY(${isPulling ? pullDistance : isRefreshing ? 60 : 0}px)`,
            transition: isPulling ? 'none' : 'transform 0.3s ease-out',
            opacity: isPulling ? Math.min(pullDistance / 80, 1) : 1
          }}
        >
          <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 flex items-center gap-2">
            <RefreshCw 
              className={`size-4 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span className="text-sm text-primary">
              {isRefreshing ? '새로고침 중' : pullDistance > 80 ? '놓아서 새로고침' : '당겨서 새로고침'}
            </span>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Popcorn className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl">영화 리뷰 피드</h1>
            <p className="text-muted-foreground text-sm">
              좋아하는 리뷰어의 최신 글을 볼 수 있어요
            </p>
          </div>
        </div>

        {/* 탭 */}
        <FeedFilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          followingCount={followingIds.length}
        />
      </div>

      {/* 로딩 상태 */}
      {loading && <FeedLoadingState />}

      {/* 포스트 목록 */}
      {!loading && sortedPosts.length === 0 && (
        <FeedEmptyState type={activeTab} />
      )}

      {!loading && sortedPosts.length > 0 && (
        <div className="space-y-6">
          {sortedPosts.map((post) => {
            const author = getUserById(post.authorId);
            const isFollowing = followingIds.includes(post.authorId);

            return (
              <ReviewCard
                key={post.id}
                post={post}
                author={author}
                currentUser={currentUser}
                isFollowing={isFollowing}
                variant={{
                  state: post.spoilerFree === false ? 'spoiler' : 'default',
                  rating: post.rating as 1 | 2 | 3 | 4 | 5,
                  userType: isFollowing ? 'follower' : 'anonymous'
                }}
                onFollowToggle={onFollowToggle}
                onLikeToggle={onLikeToggle}
                onSharePost={handleSharePost}
                onUserProfileClick={onUserProfileClick}
                onCommentClick={(post) => {
                  setSelectedPost(post);
                  setScrollToComments(true);
                }}
                onSpoilerConsent={(postId) => {
                  setSpoilerConsent(prev => ({ ...prev, [postId]: true }));
                }}
                onHidePost={handleHidePost}
                onBlockUser={handleBlockUser}
                onReportPost={handleReportPost}
                onEditPost={onEditPost}
                onDeletePost={onDeletePost}
              />
            );
          })}
        </div>
      )}

      {/* 게시글 상세 모달 */}
      <PostDetailModal
        post={selectedPost}
        author={selectedPost ? getUserById(selectedPost.authorId) : null}
        currentUser={currentUser}
        comments={selectedPost ? postComments[selectedPost.id] || [] : []}
        open={!!selectedPost}
        spoilerConsent={selectedPost ? spoilerConsent[selectedPost.id] || false : false}
        onSpoilerConsent={(postId) => {
          setSpoilerConsent(prev => ({ ...prev, [postId]: true }));
        }}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPost(null);
            setScrollToComments(false);
          }
        }}
        onLikeToggle={onLikeToggle}
        onFollowToggle={onFollowToggle}
        onSharePost={handleSharePost}
        onUserProfileClick={handleUserProfileClickWithModalClose}
        onAddComment={onAddComment}
        onAddReply={onAddReply}
        onCommentLikeToggle={onCommentLikeToggle}
        onDeleteComment={onDeleteComment}
        onEditPost={onEditPost}
        onDeletePost={onDeletePost}
        isFollowing={selectedPost ? followingIds.includes(selectedPost.authorId) : false}
        scrollToComments={scrollToComments}
      />
    </div>
  );
}
