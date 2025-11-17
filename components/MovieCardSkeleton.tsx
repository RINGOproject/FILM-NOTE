import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

export function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-primary/20">
      <Skeleton className="aspect-[2/3] w-full" />
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-20" />
      </div>
    </Card>
  );
}
