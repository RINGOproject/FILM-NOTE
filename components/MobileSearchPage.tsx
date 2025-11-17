import { useState, useMemo, useEffect } from 'react';
import { Movie } from '../types/movie';
import { MovieAPI } from '../utils/movieApi';
import { MovieCard } from './MovieCard';
import { FilterTabs } from './FilterTabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface MobileSearchPageProps {
  onMovieSelect: (movie: Movie) => void;
}

export function MobileSearchPage({ onMovieSelect }: MobileSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // 영화 데이터 로드
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const moviesData = await MovieAPI.getAllMovies();
        setMovies(moviesData);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // 영화 검색 및 필터링
  useEffect(() => {
    const searchMovies = async () => {
      try {
        const results = await MovieAPI.searchMovies(
          searchQuery || undefined,
          selectedGenre !== 'All' ? selectedGenre : undefined,
          selectedPlatform !== 'All' ? selectedPlatform : undefined
        );
        setFilteredMovies(results);
      } catch (error) {
        console.error('Error searching movies:', error);
        setFilteredMovies([]);
      }
    };

    if (movies.length > 0) {
      searchMovies();
    }
  }, [searchQuery, selectedGenre, selectedPlatform, movies]);

  // 장르 및 플랫폼별 개수 계산
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = { All: movies.length };
    movies.forEach(movie => {
      counts[movie.genre] = (counts[movie.genre] || 0) + 1;
    });
    return counts;
  }, [movies]);

  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = { All: movies.length };
    movies.forEach(movie => {
      counts[movie.platform] = (counts[movie.platform] || 0) + 1;
    });
    return counts;
  }, [movies]);

  return (
    <div className="space-y-6">
      {/* 검색바 */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 border-b z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="영화 제목으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-input-background border-primary/20 focus:border-primary/40"
          />
        </div>
      </div>

      {/* 필터 */}
      <FilterTabs
        selectedGenre={selectedGenre}
        selectedPlatform={selectedPlatform}
        onGenreChange={setSelectedGenre}
        onPlatformChange={setSelectedPlatform}
        genreCounts={genreCounts}
        platformCounts={platformCounts}
      />

      {/* 결과 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2>검색 결과</h2>
          <Badge variant="secondary">
            {filteredMovies.length}개 영화
          </Badge>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-primary">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>영화를 검색하는 중...</span>
            </div>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={onMovieSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}