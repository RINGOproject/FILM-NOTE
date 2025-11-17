import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '../lib/utils';

const GENRES = ['Action', 'Romance', 'Comedy', 'Horror', 'Drama', 'Thriller', 'Animation', 'Documentary'];
const PLATFORMS = ['Netflix', 'Disney+', 'Wavve', 'Tving', 'Watcha'];
const SORT_OPTIONS = [
  { value: 'recommended', label: '추천순' },
  { value: 'rating', label: '평점순' },
  { value: 'latest', label: '최신순' }
];

export interface FilterOptions {
  genres: string[];
  platforms: string[];
  yearRange: [number, number];
  runtimeRange: [number, number];
  sortBy: 'recommended' | 'rating' | 'latest';
}

interface FilterBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
}

export function FilterBottomSheet({ 
  open, 
  onOpenChange, 
  currentFilters,
  onApply 
}: FilterBottomSheetProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  // 모달이 열릴 때마다 현재 필터 상태로 초기화
  useEffect(() => {
    if (open) {
      setFilters(currentFilters);
    }
  }, [open, currentFilters]);

  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const togglePlatform = (platform: string) => {
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      genres: [],
      platforms: [],
      yearRange: [2000, 2025],
      runtimeRange: [60, 180],
      sortBy: 'recommended'
    };
    setFilters(resetFilters);
  };

  const activeFilterCount = 
    filters.genres.length + 
    filters.platforms.length +
    (filters.yearRange[0] !== 2000 || filters.yearRange[1] !== 2025 ? 1 : 0) +
    (filters.runtimeRange[0] !== 60 || filters.runtimeRange[1] !== 180 ? 1 : 0) +
    (filters.sortBy !== 'recommended' ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] overflow-y-auto bg-secondary backdrop-blur-lg border-t border-primary/20 shadow-2xl"
        style={{ boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3)' }}
      >
        <SheetHeader className="pb-4 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="size-5 text-primary" />
              <SheetTitle className="text-lg">필터</SheetTitle>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="bg-primary/20">
                  {activeFilterCount}개 적용
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              초기화
            </Button>
          </div>
          <SheetDescription className="text-left">
            원하는 조건으로 영화를 검색해보세요
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* 장르 (멀티 선택) */}
          <div className="space-y-3">
            <h3 className="text-sm">장르</h3>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={cn(
                    "px-3 py-2 rounded-2xl text-sm transition-all duration-200",
                    filters.genres.includes(genre)
                      ? "bg-[#FFD700] text-background shadow-md"
                      : "bg-secondary/50 text-foreground hover:bg-secondary/80"
                  )}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* 플랫폼 (멀티 선택) */}
          <div className="space-y-3">
            <h3 className="text-sm">플랫폼</h3>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => {
                const platformColors: Record<string, string> = {
                  'Netflix': filters.platforms.includes(platform) ? 'bg-red-500 text-white' : 'bg-red-500/10 text-foreground hover:bg-red-500/20',
                  'Disney+': filters.platforms.includes(platform) ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-foreground hover:bg-blue-500/20',
                  'Wavve': filters.platforms.includes(platform) ? 'bg-purple-500 text-white' : 'bg-purple-500/10 text-foreground hover:bg-purple-500/20',
                  'Tving': filters.platforms.includes(platform) ? 'bg-orange-500 text-white' : 'bg-orange-500/10 text-foreground hover:bg-orange-500/20',
                  'Watcha': filters.platforms.includes(platform) ? 'bg-pink-500 text-white' : 'bg-pink-500/10 text-foreground hover:bg-pink-500/20',
                };
                
                return (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={cn(
                      "px-3 py-2 rounded-2xl text-sm transition-all duration-200 shadow-sm",
                      platformColors[platform]
                    )}
                  >
                    {platform}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 출시연도 (슬라이더) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm">출시연도</h3>
              <span className="text-sm text-muted-foreground">
                {filters.yearRange[0]} - {filters.yearRange[1]}
              </span>
            </div>
            <Slider
              min={2000}
              max={2025}
              step={1}
              value={filters.yearRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, yearRange: value as [number, number] }))}
              className="w-full"
            />
          </div>

          {/* 러닝타임 (슬라이더) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm">러닝타임</h3>
              <span className="text-sm text-muted-foreground">
                {filters.runtimeRange[0]} - {filters.runtimeRange[1]}분
              </span>
            </div>
            <Slider
              min={60}
              max={180}
              step={10}
              value={filters.runtimeRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, runtimeRange: value as [number, number] }))}
              className="w-full"
            />
          </div>

          {/* 정렬 기준 (라디오 버튼) */}
          <div className="space-y-3">
            <h3 className="text-sm">정렬 기준</h3>
            <RadioGroup
              value={filters.sortBy}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as FilterOptions['sortBy'] }))}
              className="space-y-2"
            >
              {SORT_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* 적용 버튼 */}
        <div className="sticky bottom-0 pt-6 pb-6 bg-gradient-to-t from-secondary via-secondary to-transparent">
          <Button 
            onClick={handleApply}
            className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg text-base"
          >
            적용하기
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
