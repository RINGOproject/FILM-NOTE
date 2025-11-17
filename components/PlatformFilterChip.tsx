import { cn } from './ui/utils';

interface PlatformFilterChipProps {
  platform: '전체' | 'Netflix' | 'Disney+' | 'Wavve' | 'Tving' | 'Watcha';
  state: 'default' | 'selected';
  count?: number;
  onClick?: () => void;
}

// 플랫폼별 브랜드 색상
const PLATFORM_COLORS = {
  '전체': {
    bg: 'bg-secondary/50',
    selectedBg: 'bg-primary',
    selectedText: 'text-primary-foreground',
    hover: 'hover:bg-secondary/80'
  },
  'Netflix': {
    bg: 'bg-red-500/10',
    selectedBg: 'bg-red-500',
    selectedText: 'text-white',
    hover: 'hover:bg-red-500/20'
  },
  'Disney+': {
    bg: 'bg-blue-500/10',
    selectedBg: 'bg-blue-500',
    selectedText: 'text-white',
    hover: 'hover:bg-blue-500/20'
  },
  'Wavve': {
    bg: 'bg-purple-500/10',
    selectedBg: 'bg-purple-500',
    selectedText: 'text-white',
    hover: 'hover:bg-purple-500/20'
  },
  'Tving': {
    bg: 'bg-orange-500/10',
    selectedBg: 'bg-orange-500',
    selectedText: 'text-white',
    hover: 'hover:bg-orange-500/20'
  },
  'Watcha': {
    bg: 'bg-pink-500/10',
    selectedBg: 'bg-pink-500',
    selectedText: 'text-white',
    hover: 'hover:bg-pink-500/20'
  }
};

export function PlatformFilterChip({ platform, state, count, onClick }: PlatformFilterChipProps) {
  const colors = PLATFORM_COLORS[platform];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        // Base styles - Auto Layout, 전체 width 균등 분배
        "flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-2xl transition-all duration-200",
        "text-sm whitespace-nowrap min-w-0",
        
        // Default state
        state === 'default' && [
          colors.bg,
          colors.hover,
          "text-foreground",
          "border border-transparent"
        ],
        
        // Selected state - 플랫폼별 브랜드 색상
        state === 'selected' && [
          colors.selectedBg,
          colors.selectedText,
          "shadow-md border",
          "border-current/20"
        ]
      )}
    >
      <span className="truncate">{platform}</span>
      {count !== undefined && (
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full shrink-0",
          state === 'selected' ? "bg-white/20" : "bg-background/10"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}
