import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from './ui/utils';

// 장르 목록
const GENRES = ['Action', 'Romance', 'Comedy', 'Horror', 'Drama', 'Thriller', 'Animation', 'Documentary'];

// 플랫폼 목록
const PLATFORMS = ['Netflix', 'Disney+', 'Wavve', 'Tving', 'Watcha'];

// 정렬 옵션
const SORT_OPTIONS = [
  { value: 'recommended', label: '추천순' },
  { value: 'rating', label: '평점순' },
  { value: 'latest', label: '최신순' }
];

// 플랫폼별 색상
const PLATFORM_COLORS: Record<string, { bg: string; selected: string }> = {
  'Netflix': { bg: 'bg-red-500/10 hover:bg-red-500/20', selected: 'bg-red-500 text-white' },
  'Disney+': { bg: 'bg-blue-500/10 hover:bg-blue-500/20', selected: 'bg-blue-500 text-white' },
  'Wavve': { bg: 'bg-purple-500/10 hover:bg-purple-500/20', selected: 'bg-purple-500 text-white' },
  'Tving': { bg: 'bg-orange-500/10 hover:bg-orange-500/20', selected: 'bg-orange-500 text-white' },
  'Watcha': { bg: 'bg-pink-500/10 hover:bg-pink-500/20', selected: 'bg-pink-500 text-white' }
};

export interface FilterOptions {
  genres: string[];
  platforms: string[];
  yearRange: [number, number];
  runtimeRange: [number, number];
  sortBy: 'recommended' | 'rating' | 'latest';
}

interface AdvancedFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
}

export function AdvancedFilterSheet({ 
  open, 
  onOpenChange, 
  currentFilters,
  onApply 
}: AdvancedFilterSheetProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  // 모달이 열릴 때마다 현재 필터 상태로 초기화
  useEffect(() => {
    if (open) {
      setFilters(currentFilters);
    }
  }, [open, currentFilters]);

  // 장르 토글
  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  // 플랫폼 토글
  const togglePlatform = (platform: string) => {
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  // 적용 버튼
  const handleApply = () => {
    onApply(filters);
    onOpenChange(false);
  };

  // 초기화 버튼
  const handleReset = () => {
    const resetFilters: FilterOptions = {
      genres: [],
      platforms: [],
      yearRange: [1910, 2025],
      runtimeRange: [0, 500],
      sortBy: 'recommended'
    };
    setFilters(resetFilters);
  };

  // 활성 필터 개수
  const activeFilterCount = 
    filters.genres.length + 
    filters.platforms.length +
    (filters.yearRange[0] !== 1910 || filters.yearRange[1] !== 2025 ? 1 : 0) +
    (filters.runtimeRange[0] !== 0 || filters.runtimeRange[1] !== 500 ? 1 : 0) +
    (filters.sortBy !== 'recommended' ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* 배경은 color.surface.secondary (bg-secondary), 섀도우는 elevation.level.3 */}
      <SheetContent 
        side="bottom" 
        className="h-[85vh] overflow-y-auto bg-secondary/98 backdrop-blur-xl border-t-2 border-primary/10"
        style={{ boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.4), 0 -2px 8px rgba(0, 0, 0, 0.2)' }}
      >
        {/* 헤더 */}
        <SheetHeader className="pb-5 border-b border-primary/10 sticky top-0 bg-secondary/95 backdrop-blur-sm z-10 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <SlidersHorizontal className="size-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg">상세 필터</SheetTitle>
                {activeFilterCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeFilterCount}개의 필터가 적용됨
                  </p>
                )}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="gap-2"
            >
              <X className="size-4" />
              초기화
            </Button>
          </div>
          <SheetDescription className="text-left text-xs">
            원하는 조건으로 영화를 검색하세요
          </SheetDescription>
        </SheetHeader>

        {/* 필터 옵션들 */}
        <div className="py-6 space-y-8 pb-24">
          {/* 장르 (멀티 선택) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm">장르</h3>
              {filters.genres.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.genres.length}개 선택
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm transition-all duration-200 border",
                    filters.genres.includes(genre)
                      ? "bg-[#FFD700] text-background border-[#FFD700] shadow-md scale-105"
                      : "bg-background/50 text-foreground border-primary/20 hover:bg-background/80 hover:border-primary/40"
                  )}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* 플랫폼 (멀티 선택) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm">플랫폼</h3>
              {filters.platforms.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.platforms.length}개 선택
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => {
                const colors = PLATFORM_COLORS[platform];
                const isSelected = filters.platforms.includes(platform);
                
                return (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm transition-all duration-200 border",
                      isSelected
                        ? `${colors.selected} border-transparent shadow-md scale-105`
                        : `${colors.bg} text-foreground border-primary/20 hover:border-primary/40`
                    )}
                  >
                    {platform}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 출시연도 (슬라이더, 1910~2025) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm">출시연도</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {filters.yearRange[0]}
                </Badge>
                <span className="text-xs text-muted-foreground">~</span>
                <Badge variant="outline" className="text-xs">
                  {filters.yearRange[1]}
                </Badge>
              </div>
            </div>
            <div className="pt-2">
              <Slider
                min={1910}
                max={2025}
                step={1}
                value={filters.yearRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, yearRange: value as [number, number] }))}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>1910</span>
                <span>2025</span>
              </div>
            </div>
          </div>

          {/* 러닝타임 (슬라이더, 0~500분) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm">러닝타임</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {filters.runtimeRange[0]}분
                </Badge>
                <span className="text-xs text-muted-foreground">~</span>
                <Badge variant="outline" className="text-xs">
                  {filters.runtimeRange[1]}분
                </Badge>
              </div>
            </div>
            <div className="pt-2">
              <Slider
                min={0}
                max={500}
                step={10}
                value={filters.runtimeRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, runtimeRange: value as [number, number] }))}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>0분</span>
                <span>500분</span>
              </div>
            </div>
          </div>

          {/* 정렬 기준 (라디오 버튼: 추천순 / 평점순 / 최신순) */}
          <div className="space-y-4">
            <h3 className="text-sm">정렬 기준</h3>
            <RadioGroup
              value={filters.sortBy}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as FilterOptions['sortBy'] }))}
              className="space-y-3"
            >
              {SORT_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background/50 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="cursor-pointer text-sm flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* 적용 버튼 - 하단 고정 */}
        <div className="sticky bottom-0 left-0 right-0 pt-4 pb-6 bg-gradient-to-t from-secondary via-secondary/95 to-transparent border-t border-primary/10">
          <Button 
            onClick={handleApply}
            className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg text-base"
          >
            필터 적용하기
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
