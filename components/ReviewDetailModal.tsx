import { BlogPost } from '../types/movie';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { MoreOptionsMenu } from './MoreOptionsMenu';
import { 
  Star, 
  Heart,
  Calendar,
  Film,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface ReviewDetailModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser?: { id: string };
  onEditPost?: (post: BlogPost) => void;
  onDeletePost?: (postId: string) => void;
}

export function ReviewDetailModal({ post, isOpen, onClose, currentUser, onEditPost, onDeletePost }: ReviewDetailModalProps) {
  if (!post) return null;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }, (_, i) => (
          <Star
            key={`full-${i}`}
            className="size-5 fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <div className="relative size-5">
            <Star className="absolute inset-0 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {Array.from({ length: 5 - Math.ceil(rating) }, (_, i) => (
          <Star
            key={`empty-${i}`}
            className="size-5 text-gray-300"
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-2">
            <DialogTitle className="text-xl flex-1">{post.title}</DialogTitle>
            {currentUser && (
              <MoreOptionsMenu
                isOwnContent={post.authorId === currentUser.id}
                onEdit={onEditPost ? () => {
                  onEditPost(post);
                  onClose();
                } : undefined}
                onDelete={onDeletePost ? () => {
                  onDeletePost(post.id);
                  onClose();
                } : undefined}
                onHide={() => {
                  console.log('포스트 숨기기:', post.id);
                  onClose();
                }}
                onBlock={() => {
                  console.log('사용자 차단:', post.authorId);
                  onClose();
                }}
                onReport={() => {
                  console.log('포스트 신고:', post.id);
                }}
                className="shrink-0"
              />
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* 영화 정보 */}
            <div className="flex items-center gap-3">
              <Film className="size-5 text-primary" />
              <span className="text-lg">{post.movieTitle}</span>
            </div>

            {/* 평점 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {renderStars(post.rating)}
                <span className="text-lg ml-2">{post.rating}.0</span>
              </div>
            </div>

            {/* 메타 정보 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>{new Date(post.date).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className={`size-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{post.likes.toLocaleString()}개의 좋아요</span>
              </div>
            </div>

            <Separator />

            {/* 리뷰 내용 */}
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {post.content}
                </p>
              </div>
            </div>

            {/* 장단점 */}
            {(post.pros && post.pros.length > 0) || (post.cons && post.cons.length > 0) ? (
              <>
                <Separator />
                <div className="grid md:grid-cols-2 gap-4">
                  {post.pros && post.pros.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-500">
                        <ThumbsUp className="size-4" />
                        <span className="text-sm">장점</span>
                      </div>
                      <ul className="space-y-1 ml-6 text-sm">
                        {post.pros.map((pro, index) => (
                          <li key={index} className="text-muted-foreground">{pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {post.cons && post.cons.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-red-500">
                        <ThumbsDown className="size-4" />
                        <span className="text-sm">단점</span>
                      </div>
                      <ul className="space-y-1 ml-6 text-sm">
                        {post.cons.map((con, index) => (
                          <li key={index} className="text-muted-foreground">{con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : null}



            {/* 태그 */}
            {post.tags && post.tags.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">태그</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 스포일러 경고 */}
            {(post.spoiler || !post.spoilerFree) && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-3">
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="size-3" />
                    스포일러 포함
                  </Badge>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
