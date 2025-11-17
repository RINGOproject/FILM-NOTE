import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { MovieCardSkeleton } from './MovieCardSkeleton';

// Empty State - 검색 결과가 없을 때
export function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Search className="size-10 text-primary/50" />
      </div>
      <h3 className="text-lg mb-2">검색 결과가 없습니다</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        다른 키워드로 시도해보세요
      </p>
    </div>
  );
}

// Loading State - 로딩 중일 때 (skeleton 카드 4개)
export function SearchLoadingState() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Error State - 에러 발생 시
interface SearchErrorStateProps {
  onRetry?: () => void;
}

export function SearchErrorState({ onRetry }: SearchErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="size-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="size-10 text-destructive/70" />
      </div>
      <h3 className="text-lg mb-2">네트워크 연결을 확인해주세요</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        인터넷 연결 상태를 확인하고 다시 시도해주세요
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="size-4" />
          재시도
        </Button>
      )}
    </div>
  );
}
