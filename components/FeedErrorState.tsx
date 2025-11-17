import { WifiOff } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface FeedErrorStateProps {
  onRetry?: () => void;
}

export function FeedErrorState({ onRetry }: FeedErrorStateProps) {
  return (
    <Card>
      <CardContent className="py-16 text-center">
        <WifiOff className="size-16 mx-auto mb-4 text-muted-foreground/30" />
        <h3 className="text-muted-foreground mb-2">
          서버 연결에 실패했어요
        </h3>
        <p className="text-sm text-muted-foreground/70 mb-6">
          잠시 후 다시 시도해주세요
        </p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            다시 시도
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
