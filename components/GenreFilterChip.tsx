import { cn } from './ui/utils';

interface GenreFilterChipProps {
  category: '전체' | 'Action' | 'Romance' | 'Comedy' | 'Horror' | 'Drama' | 'Thriller' | 'Animation' | 'Documentary';
  state: 'default' | 'selected' | 'disabled';
  count?: number;
  onClick?: () => void;
}

export function GenreFilterChip({ category, state, count, onClick }: GenreFilterChipProps) {
  return (
    <button
      onClick={state === 'disabled' ? undefined : onClick}
      disabled={state === 'disabled'}
      className={cn(
        // Base styles - Auto Layout padding: 8px 12px, corner radius: 16px
        "inline-flex items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-200",
        "text-sm whitespace-nowrap shrink-0",
        
        // Default state
        state === 'default' && [
          "bg-secondary/50 hover:bg-secondary/80",
          "text-foreground",
          "border border-transparent hover:border-primary/20"
        ],
        
        // Selected state - color.accent (#FFD700)
        state === 'selected' && [
          "bg-[#FFD700] hover:bg-[#FFD700]/90",
          "text-background shadow-md",
          "border border-[#FFD700]"
        ],
        
        // Disabled state - color.text.disabled
        state === 'disabled' && [
          "bg-secondary/30",
          "text-muted-foreground/40",
          "cursor-not-allowed opacity-60"
        ]
      )}
    >
      <span className="truncate">{category}</span>
      {count !== undefined && (
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full",
          state === 'selected' ? "bg-background/20" : "bg-background/10"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}
