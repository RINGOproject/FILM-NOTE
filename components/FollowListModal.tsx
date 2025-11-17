import { UserProfile } from '../types/movie';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { VerificationBadge } from './VerificationBadge';
import { 
  Users, 
  UserPlus, 
  UserMinus,
  MessageCircle
} from 'lucide-react';

interface FollowListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'followers' | 'following';
  users: UserProfile[];
  currentUserId: string;
  followingIds: string[];
  onFollowToggle: (userId: string) => void;
  onUserProfileClick: (userId: string) => void;
}

export function FollowListModal({
  open,
  onOpenChange,
  type,
  users,
  currentUserId,
  followingIds,
  onFollowToggle,
  onUserProfileClick
}: FollowListModalProps) {
  const title = type === 'followers' ? '팔로워' : '팔로잉';
  const isCurrentUserList = true; // 현재는 현재 사용자의 리스트만 표시

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] cinema-glow">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            {title} ({users.length})
          </DialogTitle>
          <DialogDescription>
            {type === 'followers' 
              ? '나를 팔로우하는 사용자 목록입니다' 
              : '내가 팔로우하는 사용자 목록입니다'
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-96">
          <div className="space-y-3 pr-4">
            {users.length > 0 ? (
              users.map((user) => {
                const isFollowing = followingIds.includes(user.id);
                const isCurrentUser = user.id === currentUserId;

                return (
                  <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                    <Avatar 
                      className="size-12 cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all"
                      onClick={() => {
                        onUserProfileClick(user.id);
                        onOpenChange(false);
                      }}
                    >
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 
                          className="font-medium truncate cursor-pointer hover:text-primary transition-colors"
                          onClick={() => {
                            onUserProfileClick(user.id);
                            onOpenChange(false);
                          }}
                        >
                          {user.name}
                        </h4>
                        {user.verified && (
                          <VerificationBadge level={user.verified} size="sm" />
                        )}
                      </div>
                      
                      {user.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {user.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="size-3" />
                          <span>{user.stats.totalReviews}개 리뷰</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="size-3" />
                          <span>팔로워 {user.followersCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {!isCurrentUser && (
                      <Button
                        variant={isFollowing ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => onFollowToggle(user.id)}
                        className="gap-1 shrink-0"
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
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="size-12 mx-auto mb-4 opacity-50" />
                <p>
                  {type === 'followers' 
                    ? '아직 팔로워가 없습니다.' 
                    : '아직 팔로우하는 사람이 없습니다.'
                  }
                </p>
                <p className="text-sm mt-1">
                  {type === 'followers'
                    ? '좋은 리뷰를 작성하여 팔로워를 늘려보세요!'
                    : '관심있는 리뷰어를 팔로우해보세요!'
                  }
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}