import { Heart, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface FeedEmptyStateProps {
  type: 'following' | 'all';
}

export function FeedEmptyState({ type }: FeedEmptyStateProps) {
  if (type === 'following') {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          <Users className="size-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-muted-foreground mb-2">
            아직 팔로우한 리뷰어가 없어요
          </h3>
          <p className="text-sm text-muted-foreground/70">
            좋아하는 리뷰를 찾아 팔로우해보세요
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="py-16 text-center">
        <Heart className="size-16 mx-auto mb-4 text-muted-foreground/30" />
        <h3 className="text-muted-foreground mb-2">
          아직 작성된 리뷰가 없어요
        </h3>
        <p className="text-sm text-muted-foreground/70">
          첫 번째 리뷰를 작성해보세요
        </p>
      </CardContent>
    </Card>
  );
}
