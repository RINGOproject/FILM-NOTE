import { Home, Search, PlusCircle, User, Rss } from 'lucide-react';
import { Button } from './ui/button';

interface BottomNavigationProps {
  activeTab: 'home' | 'search' | 'feed' | 'write' | 'profile';
  onTabChange: (tab: 'home' | 'search' | 'feed' | 'write' | 'profile') => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'home' as const, icon: Home, label: '홈' },
    { id: 'feed' as const, icon: Rss, label: '피드' },
    { id: 'search' as const, icon: Search, label: '검색' },
    { id: 'write' as const, icon: PlusCircle, label: '작성' },
    { id: 'profile' as const, icon: User, label: '프로필' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-primary/20 cinema-glow">
      <div className="grid grid-cols-5 h-16">
        {tabs.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            className={`relative flex flex-col items-center justify-center h-full rounded-none gap-1 transition-all duration-300 ${
              activeTab === id ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
            }`}
            onClick={() => onTabChange(id)}
          >
            {/* 상단 2px indicator */}
            {activeTab === id && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            )}
            <Icon className={`size-5 transition-all ${activeTab === id ? 'fill-current drop-shadow-glow scale-110' : ''}`} />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}