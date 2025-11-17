import { Button } from './ui/button';
import { UserCheck } from 'lucide-react';

interface FeedFilterTabsProps {
  activeTab: 'following' | 'all';
  onTabChange: (tab: 'following' | 'all') => void;
  followingCount: number;
  variant?: {
    tab?: 'following' | 'all';
    state?: 'selected' | 'unselected';
  };
}

export function FeedFilterTabs({ 
  activeTab, 
  onTabChange, 
  followingCount,
  variant = {}
}: FeedFilterTabsProps) {
  const isFollowingSelected = activeTab === 'following';
  const isAllSelected = activeTab === 'all';

  return (
    <div className="flex gap-3">
      <Button
        variant="ghost"
        onClick={() => onTabChange('following')}
        className={`relative gap-2 px-4 py-2 h-auto transition-all ${
          isFollowingSelected 
            ? 'text-primary bg-primary/10 hover:bg-primary/15' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <UserCheck className={`size-4 ${isFollowingSelected ? 'fill-current' : ''}`} />
        <span className="text-sm">팔로잉</span>
        {followingCount > 0 && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            isFollowingSelected 
              ? 'bg-primary/20 text-primary' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {followingCount}
          </span>
        )}
        {isFollowingSelected && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        )}
      </Button>

      <Button
        variant="ghost"
        onClick={() => onTabChange('all')}
        className={`relative px-4 py-2 h-auto transition-all ${
          isAllSelected 
            ? 'text-primary bg-primary/10 hover:bg-primary/15' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <span className="text-sm">전체 리뷰</span>
        {isAllSelected && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        )}
      </Button>
    </div>
  );
}
