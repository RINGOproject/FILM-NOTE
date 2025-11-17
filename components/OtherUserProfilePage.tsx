import { useState } from 'react';
import { User, BlogPost } from '../types/movie';
import { MovieAPI } from '../utils/movieApi';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { ArrowLeft, MessageCircle, Users, UserPlus, UserMinus, Grid3X3, Calendar, Star, Heart, Share2 } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';
import { SpoilerContent } from './SpoilerContent';
import { PostDetailModal } from './PostDetailModal';
import { ShareModal } from './ShareModal';
import { FollowListModal } from './FollowListModal';

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

interface OtherUserProfilePageProps {
  user: User;
  blogPosts: BlogPost[];
  allUsers: User[];
  followingIds: string[];
  isFollowing: boolean;
  currentUser: User;
  postComments: Record<string, Comment[]>;
  onBack: () => void;
  onFollowToggle: (userId: string) => void;
  onLikeToggle: (postId: string) => void;
  onUserProfileClick: (userId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onAddReply: (postId: string, parentId: string, content: string) => void;
  onCommentLikeToggle: (postId: string, commentId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onEditPost?: (post: BlogPost) => void;
  onDeletePost?: (postId: string) => void;
}

export function OtherUserProfilePage({
  user,
  blogPosts,
  allUsers,
  followingIds,
  isFollowing,
  currentUser,
  postComments,
  onBack,
  onFollowToggle,
  onLikeToggle,
  onUserProfileClick,
  onAddComment,
  onAddReply,
  onCommentLikeToggle,
  onDeleteComment,
  onEditPost,
  onDeletePost
}: OtherUserProfilePageProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [sharePost, setSharePost] = useState<BlogPost | null>(null);
  const [scrollToComments, setScrollToComments] = useState(false);
  const [followListOpen, setFollowListOpen] = useState(false);
  const [followListType, setFollowListType] = useState<'followers' | 'following'>('followers');
  const [followListUsers, setFollowListUsers] = useState<User[]>([]);
  const [loadingFollowList, setLoadingFollowList] = useState(false);

  // 사용자의 게시물만 필터링
  const userPosts = blogPosts.filter(post => post.authorId === user.id);

  // 팔로워 및 팔로잉 계산
  const followers = allUsers.filter(u => followingIds.includes(user.id));
  const following = allUsers.filter(u => followingIds.includes(u.id));

  // 좋아요 핸들러
  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    onLikeToggle(postId);
  };

  // 댓글 핸들러
  const handleComment = (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    setSelectedPost(post);
    setScrollToComments(true);
  };

  // 공유 핸들러
  const handleShare = (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    setSharePost(post);
  };

  // 팔로우 목록 열기 (데이터베이스에서 로드)
  const handleOpenFollowList = async (type: 'followers' | 'following') => {
    setLoadingFollowList(true);
    setFollowListType(type);
    try {
      let users: User[] = [];
      if (type === 'followers') {
        users = await MovieAPI.getUserFollowersDetails(user.id);
      } else {
        users = await MovieAPI.getUserFollowingDetails(user.id);
      }
      setFollowListUsers(users);
      setFollowListOpen(true);
    } catch (error) {
      console.error('Error loading follow list:', error);
      setFollowListUsers([]);
    } finally {
      setLoadingFollowList(false);
    }
  };

  // 사용자 프로필 클릭 핸들러 (모달 닫기 포함)
  const handleUserProfileClickWithModalClose = (userId: string) => {
    // 먼저 모달들을 모두 닫기
    setSelectedPost(null);
    setSharePost(null);
    setScrollToComments(false);
    
    // 그 다음 프로필 페이지로 이동
    onUserProfileClick(userId);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1>프로필</h1>
      </div>

      {/* 프로필 정보 */}
      <Card className="cinema-glow">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* 아바타 및 기본 정보 */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="size-20 sm:size-24 ring-2 ring-primary/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="text-center sm:text-left space-y-3">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2>{user.name}</h2>
                  <VerificationBadge level={user.verificationLevel} />
                </div>
                
                <p className="text-muted-foreground">{user.bio}</p>
                
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Calendar className="size-4 text-primary" />
                  <span className="text-sm text-muted-foreground">가입일</span>
                  <span className="text-sm text-foreground font-medium">{user.joinDate}</span>
                </div>
              </div>
            </div>

            {/* 팔로우 버튼 */}
            <div className="flex-1 flex justify-center sm:justify-end">
              <Button
                onClick={() => onFollowToggle(user.id)}
                variant={isFollowing ? "outline" : "default"}
                className="min-w-[120px]"
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="size-4 mr-2" />
                    팔로잉
                  </>
                ) : (
                  <>
                    <UserPlus className="size-4 mr-2" />
                    팔로우
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 통계 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors border border-primary/10">
              <div className="flex flex-col items-center gap-1 mb-2">
                <Grid3X3 className="size-5 text-primary" />
                <span className="text-xl font-bold text-foreground">{userPosts.length}</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">리뷰</p>
            </div>
            
            <div 
              className="text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors border border-primary/10 cursor-pointer"
              onClick={() => handleOpenFollowList('followers')}
            >
              <div className="flex flex-col items-center gap-1 mb-2">
                <Users className="size-5 text-primary" />
                <span className="text-xl font-bold text-foreground">{user.stats.followers}</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">팔로워</p>
            </div>
            
            <div 
              className="text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors border border-primary/10 cursor-pointer"
              onClick={() => handleOpenFollowList('following')}
            >
              <div className="flex flex-col items-center gap-1 mb-2">
                <Users className="size-5 text-primary" />
                <span className="text-xl font-bold text-foreground">{user.stats.following}</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">팔로잉</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors border border-primary/10">
              <div className="flex flex-col items-center gap-1 mb-2">
                <Star className="size-5 text-primary" />
                <span className="text-xl font-bold text-foreground">{user.stats.averageRating}</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">평균 평점</p>
            </div>
          </div>

          <Separator />

          {/* 최근 활동 */}
          <div>
            <h3 className="mb-4 flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              최근 리뷰
            </h3>
            
            {userPosts.length > 0 ? (
              <div className="grid gap-4">
                {userPosts.slice(0, 6).map((post) => (
                  <Card
                    key={post.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedPost(post)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* 영화 포스터 */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-24 bg-muted rounded-lg overflow-hidden">
                            <img
                              src={post.moviePoster}
                              alt={post.movieTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* 리뷰 내용 */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{post.movieTitle}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Star className="size-3 fill-primary text-primary" />
                                  <span>{post.rating}</span>
                                </div>
                                <span>•</span>
                                <span>{post.date}</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {post.platform}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <h5 className="font-medium">{post.title}</h5>
                            {post.spoilerFree === false ? (
                              <SpoilerContent content={post.content} isBlurred={true} limitHeight={true} />
                            ) : (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {post.content}
                              </p>
                            )}
                          </div>

                          {/* 액션 버튼들 */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={(e) => handleLike(e, post.id)}
                                className={`flex items-center gap-1 text-sm transition-colors ${
                                  post.isLiked
                                    ? 'text-red-500 hover:text-red-600'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                <Heart className={`size-4 ${post.isLiked ? 'fill-current' : ''}`} />
                                <span>{post.likes}</span>
                              </button>

                              <button
                                onClick={(e) => handleComment(e, post)}
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <MessageCircle className="size-4" />
                                <span>{post.comments}</span>
                              </button>
                            </div>

                            <button
                              onClick={(e) => handleShare(e, post)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Share2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Grid3X3 className="size-12 mx-auto mb-4 opacity-50" />
                <p>아직 작성한 리뷰가 없습니다.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 게시물 상세 모달 */}
      <PostDetailModal
        post={selectedPost}
        author={selectedPost ? allUsers.find(u => u.id === selectedPost.authorId) || null : null}
        currentUser={currentUser}
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

      {/* 공유 모달 */}
      <ShareModal
        post={sharePost}
        open={!!sharePost}
        onOpenChange={(open) => !open && setSharePost(null)}
      />

      {/* 팔로우 목록 모달 */}
      <FollowListModal
        open={followListOpen}
        onOpenChange={setFollowListOpen}
        type={followListType}
        users={followListUsers}
        currentUserId={currentUser.id}
        followingIds={followingIds}
        onFollowToggle={onFollowToggle}
        onUserProfileClick={handleUserProfileClickWithModalClose}
      />
    </div>
  );
}