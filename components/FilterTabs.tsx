import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

interface FilterTabsProps {
  selectedGenre: string;
  selectedPlatform: string;
  onGenreChange: (genre: string) => void;
  onPlatformChange: (platform: string) => void;
  genreCounts: Record<string, number>;
  platformCounts: Record<string, number>;
}

export function FilterTabs({ 
  selectedGenre, 
  selectedPlatform, 
  onGenreChange, 
  onPlatformChange,
  genreCounts,
  platformCounts 
}: FilterTabsProps) {
  const genres = ['All', 'Action', 'Romance', 'Comedy', 'Horror', 'Sci-Fi', 'Drama'];
  const platforms = ['All', 'Netflix', 'Disney+'];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-3">장르</h3>
        <div className="overflow-x-auto bg-[rgba(217,124,124,0)] scrollbar-none overscroll-x-contain scroll-smooth select-none" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x', scrollSnapType: 'x proximity' }}>
          <Tabs value={selectedGenre} onValueChange={onGenreChange}>
            <TabsList className="flex w-max min-w-full justify-start gap-1 p-1 cinema-tab-list">
              {genres.map((genre) => (
                <TabsTrigger 
                  key={genre} 
                  value={genre} 
                  className="relative text-xs whitespace-nowrap px-3 py-2 flex-shrink-0 cinema-tab-trigger"
                >
                  {genre === 'All' ? '전체' : genre}
                  {genreCounts[genre] > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-1 text-xs px-1.5 py-0 hidden sm:inline-flex"
                    >
                      {genreCounts[genre]}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div>
        <h3 className="mb-3">플랫폼</h3>
        <Tabs value={selectedPlatform} onValueChange={onPlatformChange}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            {platforms.map((platform) => (
              <TabsTrigger key={platform} value={platform} className="relative">
                {platform === 'All' ? '전체' : platform}
                {platformCounts[platform] > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 text-xs px-1.5 py-0"
                  >
                    {platformCounts[platform]}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}