import { useState, useMemo, useEffect } from 'react';
import { Movie } from '../types/movie';
import { MovieAPI } from '../utils/movieApi';
import { MovieCard } from './MovieCard';
import { SearchInput } from './SearchInput';
import { SearchEmptyState, SearchLoadingState, SearchErrorState } from './SearchStateViews';
import { AdvancedFilterSheet, FilterOptions } from './AdvancedFilterSheet';
import { Button } from './ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import { Badge } from './ui/badge';

interface SearchPageProps {
  onMovieSelect: (movie: Movie) => void;
}

export function SearchPage({ onMovieSelect }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  
  // 검색 입력 상태 관리
  const [searchState, setSearchState] = useState<'idle' | 'typing' | 'focused' | 'filled' | 'error' | 'disabled'>('idle');

  // 필터 옵션
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    genres: [],
    platforms: [],
    yearRange: [1910, 2025],
    runtimeRange: [0, 500],
    sortBy: 'recommended'
  });

  // 영화 데이터 로드
  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(false);
      
      // 영화 데이터 로드
      const moviesData = await MovieAPI.getAllMovies();
      
      // 각 영화의 실제 피드 리뷰 기반 별점 계산
      console.log('[SearchPage] 🎬 Loading movie ratings from database (BlogPost feed data)...');
      const updatedMovies = await Promise.all(
        moviesData.map(async (movie) => {
          try {
            const posts = await MovieAPI.getMoviePosts(movie.id);
            const reviewCount = posts.length;
            
            let rating = 0;
            if (reviewCount > 0) {
              const totalRating = posts.reduce((sum, post) => sum + post.rating, 0);
              rating = totalRating / reviewCount;
            }
            
            return {
              ...movie,
              reviewCount,
              rating
            };
          } catch (error) {
            console.error(`[SearchPage] Error loading reviews for movie ${movie.id}:`, error);
            return {
              ...movie,
              reviewCount: 0,
              rating: 0
            };
          }
        })
      );
      
      setMovies(updatedMovies);
    } catch (err) {
      console.error('Error loading movies:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // 검색 입력 변경 핸들러
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      setSearchState('typing');
    } else {
      setSearchState('idle');
    }
  };

  // 필터링된 영화 목록
  const filteredMovies = useMemo(() => {
    let filtered = movies;

    // 검색어 필터
    if (searchQuery.trim()) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.originalTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 고급 필터 - 장르 (멀티 선택, OR 로직)
    if (advancedFilters.genres.length > 0) {
      filtered = filtered.filter(movie => {
        // 영화의 장르를 배열로 정규화
        const movieGenres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];
        // 선택한 장르 중 하나라도 영화 장르에 포함되어 있으면 true
        return advancedFilters.genres.some(selectedGenre => 
          movieGenres.some(movieGenre => movieGenre.includes(selectedGenre))
        );
      });
    }

    // 고급 필터 - 플랫폼 (멀티 선택)
    if (advancedFilters.platforms.length > 0) {
      filtered = filtered.filter(movie => advancedFilters.platforms.includes(movie.platform));
    }

    // 고급 필터 - 출시연도
    filtered = filtered.filter(movie => 
      movie.year >= advancedFilters.yearRange[0] && 
      movie.year <= advancedFilters.yearRange[1]
    );

    // 고급 필터 - 러닝타임
    filtered = filtered.filter(movie => {
      const runtime = movie.runtime || movie.duration;
      return runtime >= advancedFilters.runtimeRange[0] && 
             runtime <= advancedFilters.runtimeRange[1];
    });

    // 정렬
    switch (advancedFilters.sortBy) {
      case 'rating':
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'latest':
        filtered = [...filtered].sort((a, b) => b.year - a.year);
        break;
      case 'recommended':
      default:
        // 기본 정렬 유지
        break;
    }

    return filtered;
  }, [movies, searchQuery, advancedFilters]);

  // 활성 필터 개수
  const activeFilterCount = 
    advancedFilters.genres.length + 
    advancedFilters.platforms.length +
    (advancedFilters.yearRange[0] !== 1910 || advancedFilters.yearRange[1] !== 2025 ? 1 : 0) +
    (advancedFilters.runtimeRange[0] !== 0 || advancedFilters.runtimeRange[1] !== 500 ? 1 : 0) +
    (advancedFilters.sortBy !== 'recommended' ? 1 : 0);

  // 로딩 상태
  if (loading) {
    return (
      <div className="space-y-6">
        <SearchLoadingState />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="space-y-6">
        <SearchErrorState onRetry={loadMovies} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 검색바 - Sticky */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 border-b z-20">
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="영화 제목으로 검색..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onClear={() => {
              setSearchQuery('');
              setSearchState('idle');
            }}
            onFocus={() => setSearchState('focused')}
            onBlur={() => setSearchState(searchQuery ? 'filled' : 'idle')}
            state={searchState}
            className="flex-1"
          />
          
          {/* 필터 버튼 */}
          <Button
            variant={activeFilterCount > 0 ? 'default' : 'outline'}
            size="icon"
            onClick={() => setFilterSheetOpen(true)}
            className="shrink-0 relative"
          >
            <SlidersHorizontal className="size-4" />
            {activeFilterCount > 0 && (
              <Badge className="absolute -top-1 -right-1 size-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-muted-foreground">
            검색 결과 ({filteredMovies.length.toLocaleString()}개)
          </h3>
          
          {/* 필터 초기화 */}
          {(searchQuery || activeFilterCount > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setAdvancedFilters({
                  genres: [],
                  platforms: [],
                  yearRange: [2000, 2025],
                  runtimeRange: [60, 180],
                  sortBy: 'recommended'
                });
                setSearchState('idle');
              }}
              className="gap-2 text-xs"
            >
              <X className="size-3" />
              초기화
            </Button>
          )}
        </div>

        {/* 영화 카드 그리드 - 카드 간 간격 12px */}
        {filteredMovies.length === 0 ? (
          <SearchEmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => onMovieSelect(movie)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 필터 바텀시트 */}
      <AdvancedFilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        currentFilters={advancedFilters}
        onApply={setAdvancedFilters}
      />
    </div>
  );
}
