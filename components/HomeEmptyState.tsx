import { Film, Sparkles } from 'lucide-react';

export function HomeEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <Film className="size-20 text-muted-foreground/30" />
        <Sparkles className="size-6 absolute -top-2 -right-2 text-primary/50 animate-pulse" />
      </div>
      <h3 className="text-muted-foreground mb-2">아직 등록된 영화가 없습니다</h3>
      <p className="text-sm text-muted-foreground/70 text-center">
        리뷰를 남기면 추천이 시작됩니다
      </p>
    </div>
  );
}
