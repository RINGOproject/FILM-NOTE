import { useState } from 'react';
import { Movie } from '../types/movie';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Search, Check, X, Eye } from 'lucide-react';

interface WatchedMoviesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  watchedMovies: string[];
  onSave: (movieIds: string[]) => void;
  movies: Movie[];
}

export function WatchedMoviesModal({ 
  open, 
  onOpenChange, 
  watchedMovies,
  onSave,
  movies
}: WatchedMoviesModalProps) {
  const [selectedMovies, setSelectedMovies] = useState<string[]>(watchedMovies);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleMovie = (movieId: string) => {
    setSelectedMovies(prev =>
      prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const handleSave = () => {
    onSave(selectedMovies);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedMovies(watchedMovies);
    setSearchQuery('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] w-[calc(100vw-2rem)] cinema-glow">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="size-5 text-primary" />
            본 영화 관리
          </DialogTitle>
          <DialogDescription>
            시청한 영화를 선택하여 프로필에 반영해보세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* 검색바 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="영화 제목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 선택된 영화 수 */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="gap-1 flex-shrink-0">
              <Check className="size-3" />
              <span className="hidden xs:inline">{selectedMovies.length}개 선택됨</span>
              <span className="xs:hidden">{selectedMovies.length}개</span>
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedMovies([])}
              className="flex-shrink-0"
            >
              전체 해제
            </Button>
          </div>

          {/* 영화 목록 */}
          <ScrollArea className="h-[50vh] sm:h-96">
            <div className="space-y-2 pr-2 sm:pr-4">
              {filteredMovies.map((movie) => {
                const isSelected = selectedMovies.includes(movie.id);
                
                return (
                  <div
                    key={movie.id}
                    className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => handleToggleMovie(movie.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleMovie(movie.id)}
                      className="flex-shrink-0"
                    />
                    
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="size-10 sm:size-12 rounded object-cover flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h4 className="font-medium truncate text-sm sm:text-base">{movie.title}</h4>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                        <span className="flex-shrink-0">{movie.year}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate">{movie.genre}</span>
                        <span className="hidden sm:inline">•</span>
                        <Badge variant="outline" className="text-xs flex-shrink-0 hidden sm:inline-flex">
                          {movie.platform}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-primary flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium">{movie.rating.toFixed(1)}</span>
                      <span className="text-xs">★</span>
                    </div>
                  </div>
                );
              })}
              
              {filteredMovies.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </ScrollArea>

          {/* 버튼 */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-3 sm:pt-4 border-t">
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              총 {movies.length}개 영화 중 {selectedMovies.length}개 선택
            </div>
            
            <div className="flex gap-2 sm:gap-3">
              <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-initial">
                <X className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">취소</span>
              </Button>
              <Button onClick={handleSave} className="gap-2 flex-1 sm:flex-initial">
                <Check className="size-4" />
                <span className="hidden sm:inline">저장</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}