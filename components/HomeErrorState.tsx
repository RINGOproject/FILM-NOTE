import { WifiOff } from 'lucide-react';
import { Button } from './ui/button';

interface HomeErrorStateProps {
  onRetry: () => void;
}

export function HomeErrorState({ onRetry }: HomeErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <WifiOff className="size-16 text-muted-foreground/30 mb-6" />
      <h3 className="text-muted-foreground mb-2">네트워크 연결을 확인해주세요</h3>
      <p className="text-sm text-muted-foreground/70 text-center mb-6">
        인터넷 연결 상태를 확인하고 다시 시도해주세요
      </p>
      <Button 
        onClick={onRetry}
        variant="outline"
        className="border-primary/50 text-primary hover:bg-primary/10"
      >
        🔄 재시도
      </Button>
    </div>
  );
}
