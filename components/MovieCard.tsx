import { Movie } from '../types/movie';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Clock } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  variant?: {
    poster?: 'on' | 'off';
    ott?: 'none' | 'netflix' | 'disney' | 'wavve' | string;
    rating?: 'available' | 'none';
    state?: 'default' | 'hover' | 'pressed';
  };
}

// OTT 플랫폼별 색상
const OTT_COLORS = {
  Netflix: 'bg-red-600 border-red-500',
  'Disney+': 'bg-blue-600 border-blue-500',
  Wavve: 'bg-sky-500 border-sky-400',
  Watcha: 'bg-pink-600 border-pink-500',
  Tving: 'bg-red-500 border-red-400',
};

export function MovieCard({ movie, onClick, variant = {} }: MovieCardProps) {
  const {
    poster = 'on',
    ott = movie.platform,
    rating = 'available',
    state = 'default',
  } = variant;

  const showPoster = poster === 'on';
  const showRating = rating === 'available';
  const showOtt = ott !== 'none';

  // 상태별 클래스
  const stateClasses = {
    default: 'hover:scale-105 hover:shadow-xl hover:shadow-primary/20',
    hover: 'scale-105 shadow-xl shadow-primary/20',
    pressed: 'scale-[0.98] shadow-lg shadow-primary/10',
  };

  const ottColor = OTT_COLORS[ott as keyof typeof OTT_COLORS] || 'bg-black/80 border-primary/30';

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 cinema-glow overflow-hidden bg-card/80 backdrop-blur-sm border-primary/20 ${stateClasses[state]}`}
      onClick={() => onClick(movie)}
    >
      {showPoster && (
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* 플랫폼 배지 */}
          {showOtt && (
            <Badge className={`absolute top-2 right-2 backdrop-blur-sm text-white border ${ottColor}`}>
              {ott}
            </Badge>
          )}
          
          {/* 호버 시 정보 */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="text-white">
              {showRating && movie.reviewCount && movie.reviewCount > 0 ? (
                <div className="flex items-center gap-1 mb-1">
                  <Star className="size-3 fill-primary text-primary" />
                  <span className="text-sm">
                    {movie.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-white/70">({movie.reviewCount}개)</span>
                </div>
              ) : showRating ? (
                <div className="text-xs text-white/70 mb-1">평가 대기중</div>
              ) : null}
              <p className="text-xs text-white/90 line-clamp-2">
                {movie.description}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-3 space-y-2 bg-gradient-to-b from-card to-card/50">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-foreground">{movie.title}</h3>
          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap">
            {movie.year}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          {showRating && movie.reviewCount && movie.reviewCount > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="size-3 fill-primary text-primary" />
              <span className="text-sm text-primary">
                {movie.rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({movie.reviewCount})
              </span>
            </div>
          ) : showRating ? (
            <div className="text-xs text-muted-foreground">평가 대기중</div>
          ) : (
            <div className="text-xs text-muted-foreground">평가 대기중</div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="size-3" />
              <span>{movie.runtime || movie.duration}분</span>
            </div>
          </div>
        </div>
        
        <Badge variant="outline" className="text-xs border-primary/20 bg-primary/10 text-foreground">
          {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
        </Badge>
      </div>
    </Card>
  );
}
