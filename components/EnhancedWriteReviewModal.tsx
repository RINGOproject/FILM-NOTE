import { useState, useEffect } from 'react';
import { Movie, BlogPost } from '../types/movie';
import { MovieAPI } from '../utils/movieApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Card, CardContent } from './ui/card';
import { 
  Star, 
  X, 
  Plus, 
  Save, 
  Film, 
  Lightbulb, 
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Target,
  Shield,
  Search
} from 'lucide-react';

interface EnhancedWriteReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPost?: BlogPost | null;
  onSave: (post: Omit<BlogPost, 'id' | 'author' | 'date' | 'authorId' | 'authorAvatar'>) => void;
  preSelectedMovieId?: string;
}

export function EnhancedWriteReviewModal({ 
  open, 
  onOpenChange, 
  editingPost, 
  onSave,
  preSelectedMovieId 
}: EnhancedWriteReviewModalProps) {
  const [selectedMovieId, setSelectedMovieId] = useState(editingPost?.movieId || '');
  const [title, setTitle] = useState(editingPost?.title || '');
  const [summary, setSummary] = useState(editingPost?.summary || '');
  const [content, setContent] = useState(editingPost?.content || '');
  const [rating, setRating] = useState(editingPost?.rating || 0);
  const [tags, setTags] = useState<string[]>(editingPost?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [pros, setPros] = useState<string[]>(editingPost?.pros || []);
  const [cons, setCons] = useState<string[]>(editingPost?.cons || []);
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');
  const [recommendation, setRecommendation] = useState<'highly_recommended' | 'recommended' | 'neutral' | 'not_recommended'>(
    editingPost?.recommendation || 'neutral'
  );
  const [spoilerFree, setSpoilerFree] = useState(editingPost?.spoilerFree ?? true);
  
  // 영화 목록 상태
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [movieSearchQuery, setMovieSearchQuery] = useState('');

  // 영화 목록 로드
  useEffect(() => {
    const loadMovies = async () => {
      if (!open) return;
      
      setMoviesLoading(true);
      try {
        const moviesData = await MovieAPI.getAllMovies();
        setMovies(moviesData);
      } catch (error) {
        console.error('Error loading movies:', error);
        setMovies([]);
      } finally {
        setMoviesLoading(false);
      }
    };

    loadMovies();
  }, [open]);

  // 편집 모드에서 기존 데이터 로드
  useEffect(() => {
    if (editingPost && open) {
      setSelectedMovieId(editingPost.movieId);
      setTitle(editingPost.title);
      setSummary(editingPost.summary || '');
      setContent(editingPost.content);
      setRating(editingPost.rating);
      setTags(editingPost.tags || []);
      setPros(editingPost.pros || []);
      setCons(editingPost.cons || []);
      setRecommendation(editingPost.recommendation || 'neutral');
      setSpoilerFree(editingPost.spoilerFree ?? true);
    } else if (!editingPost && open) {
      // 새 리뷰 작성 모드
      setSelectedMovieId(preSelectedMovieId || '');
      setTitle('');
      setSummary('');
      setContent('');
      setRating(0);
      setTags([]);
      setPros([]);
      setCons([]);
      setRecommendation('neutral');
      setSpoilerFree(true);
    }
  }, [editingPost, open, preSelectedMovieId]);

  const selectedMovie = movies.find(m => m.id === selectedMovieId);

  const recommendationOptions = [
    { value: 'highly_recommended', label: '강력 추천', color: 'bg-green-500', icon: ThumbsUp },
    { value: 'recommended', label: '추천', color: 'bg-blue-500', icon: Target },
    { value: 'neutral', label: '보통', color: 'bg-yellow-500', icon: Target },
    { value: 'not_recommended', label: '비추천', color: 'bg-red-500', icon: ThumbsDown },
  ] as const;

  const handleSave = () => {
    if (!selectedMovieId || !title.trim() || !content.trim() || rating === 0) {
      return;
    }

    onSave({
      movieId: selectedMovieId,
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      rating,
      tags,
      pros,
      cons,
      recommendation,
      spoilerFree,
      likes: editingPost?.likes || 0,
      comments: editingPost?.comments || 0,
      isLiked: editingPost?.isLiked || false
    });

    handleCancel();
  };

  const handleCancel = () => {
    setSelectedMovieId('');
    setTitle('');
    setSummary('');
    setContent('');
    setRating(0);
    setTags([]);
    setPros([]);
    setCons([]);
    setNewTag('');
    setNewPro('');
    setNewCon('');
    setRecommendation('neutral');
    setSpoilerFree(true);
    onOpenChange(false);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addPro = () => {
    if (newPro.trim() && !pros.includes(newPro.trim())) {
      setPros([...pros, newPro.trim()]);
      setNewPro('');
    }
  };

  const removePro = (proToRemove: string) => {
    setPros(pros.filter(pro => pro !== proToRemove));
  };

  const addCon = () => {
    if (newCon.trim() && !cons.includes(newCon.trim())) {
      setCons([...cons, newCon.trim()]);
      setNewCon('');
    }
  };

  const removeCon = (conToRemove: string) => {
    setCons(cons.filter(con => con !== conToRemove));
  };

  const renderStars = (currentRating: number, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`size-6 cursor-pointer transition-colors ${
          i < currentRating ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary/70'
        }`}
        onClick={() => onRatingChange?.(i + 1)}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden cinema-glow">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Film className="size-6 text-primary" />
            {editingPost ? '리뷰 수정' : '새 리뷰 작성'}
            <div className="ml-auto flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {spoilerFree ? '스포일러 프리' : '스포일러 포함'}
              </span>
            </div>
          </DialogTitle>
          <DialogDescription>
            {editingPost 
              ? '리뷰를 수정하여 더 나은 내용으로 업데이트하세요' 
              : '영화에 대한 솔직한 리뷰를 작성해보세요'
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-8 pr-4">
            {/* 영화 선택 */}
            <Card>
              <CardContent className="p-4">
                <Label className="text-base mb-3 block">영화 선택</Label>
                
                {/* 영화 검색 */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="영화 제목으로 검색..."
                    value={movieSearchQuery}
                    onChange={(e) => setMovieSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {movieSearchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMovieSearchQuery('')}
                      className="absolute right-1 top-1/2 -translate-y-1/2 size-8 p-0"
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                  {moviesLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                      영화 목록을 불러오는 중...
                    </div>
                  ) : movies.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Film className="size-8 mx-auto mb-2 opacity-50" />
                      <p>영화 목록을 불러올 수 없습니다.</p>
                    </div>
                  ) : (() => {
                    const filteredMovies = movies.filter(movie => {
                      const searchLower = movieSearchQuery.toLowerCase();
                      const titleMatch = movie.title?.toLowerCase().includes(searchLower) || false;
                      const genreMatch = movie.genre 
                        ? (Array.isArray(movie.genre)
                          ? movie.genre.some(g => g?.toLowerCase().includes(searchLower))
                          : movie.genre.toLowerCase().includes(searchLower))
                        : false;
                      const directorMatch = movie.director?.toLowerCase().includes(searchLower) || false;
                      
                      return titleMatch || genreMatch || directorMatch;
                    });

                    if (filteredMovies.length === 0) {
                      return (
                        <div className="text-center py-8 text-muted-foreground">
                          <Search className="size-8 mx-auto mb-2 opacity-50" />
                          <p>검색 결과가 없습니다.</p>
                          <p className="text-xs mt-1">다른 검색어를 시도해보세요.</p>
                        </div>
                      );
                    }

                    return filteredMovies.map((movie) => (
                      <div
                        key={movie.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                          selectedMovieId === movie.id 
                            ? 'border-primary bg-primary/10 shadow-md' 
                            : 'border-border hover:bg-muted/50'
                        }`}
                        onClick={() => {
                          setSelectedMovieId(movie.id);
                          setMovieSearchQuery('');
                        }}
                      >
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="size-14 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{movie.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {movie.year} · {movie.genre} · {movie.director}
                          </p>
                          <Badge variant="secondary" className="mt-1">
                            {movie.platform}
                          </Badge>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* 선택된 영화 미리보기 */}
            {selectedMovie && (
              <Card className="border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedMovie.poster}
                      alt={selectedMovie.title}
                      className="size-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-medium">{selectedMovie.title}</h3>
                      <p className="text-muted-foreground">
                        {selectedMovie.year} · {selectedMovie.genre} · {selectedMovie.director}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {selectedMovie.description}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {selectedMovie.platform}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <Label className="text-base">리뷰 제목</Label>
                  <Input
                    placeholder="리뷰 제목을 입력하세요..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-base"
                  />
                  
                  <Label className="text-base">한 줄 요약</Label>
                  <Input
                    placeholder="영화를 한 줄로 요약해주세요..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="text-base"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <Label className="text-base">평점</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {renderStars(rating, setRating)}
                    </div>
                    <span className="text-lg font-medium text-primary">
                      {rating > 0 ? `${rating}.0점` : '평점 선택'}
                    </span>
                  </div>

                  <Label className="text-base">추천도</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {recommendationOptions.map(({ value, label, color, icon: Icon }) => (
                      <Button
                        key={value}
                        variant={recommendation === value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setRecommendation(value)}
                        className={`justify-start gap-2 ${
                          recommendation === value ? `${color} text-white` : ''
                        }`}
                      >
                        <Icon className="size-4" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 장단점 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ThumbsUp className="size-5 text-green-500" />
                    <Label className="text-base">좋았던 점</Label>
                  </div>
                  <div className="space-y-2 mb-3">
                    {pros.map((pro) => (
                      <div key={pro} className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg">
                        <Lightbulb className="size-4 text-green-500 shrink-0" />
                        <span className="flex-1 text-sm">{pro}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePro(pro)}
                          className="size-6 p-0 hover:text-destructive"
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="좋았던 점 추가..."
                      value={newPro}
                      onChange={(e) => setNewPro(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addPro()}
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={addPro}>
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ThumbsDown className="size-5 text-red-500" />
                    <Label className="text-base">아쉬웠던 점</Label>
                  </div>
                  <div className="space-y-2 mb-3">
                    {cons.map((con) => (
                      <div key={con} className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg">
                        <AlertTriangle className="size-4 text-red-500 shrink-0" />
                        <span className="flex-1 text-sm">{con}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCon(con)}
                          className="size-6 p-0 hover:text-destructive"
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="아쉬웠던 점 추가..."
                      value={newCon}
                      onChange={(e) => setNewCon(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCon()}
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={addCon}>
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 상세 리뷰 */}
            <Card>
              <CardContent className="p-4">
                <Label className="text-base mb-3 block">상세 리뷰</Label>
                <Textarea
                  placeholder={`영화에 대한 자세한 감상을 작성해주세요...

**스토리**: 
**연기**: 
**연출**: 
**기술적 완성도**: 
**전체적인 감상**:`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="text-base leading-relaxed"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  **굵은 글씨**, *기울임체* 등 마크다운 문법을 사용할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            {/* 태그와 설정 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4">
                  <Label className="text-base mb-3 block">태그</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1 px-3 py-1 flex items-center">
                        <span>#{tag}</span>
                        <button
                          type="button"
                          className="ml-1 hover:text-destructive focus:outline-none"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeTag(tag);
                          }}
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="태그 추가..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button variant="outline" size="sm" onClick={addTag}>
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <Label className="text-base mb-4 block">설정</Label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="size-4 text-primary" />
                        <Label htmlFor="spoiler-free" className="text-sm">
                          스포일러 없는 리뷰
                        </Label>
                      </div>
                      <Switch
                        id="spoiler-free"
                        checked={spoilerFree}
                        onCheckedChange={setSpoilerFree}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {spoilerFree 
                        ? '스토리의 핵심 내용을 숨기고 작성합니다.' 
                        : '스토리의 상세 내용을 포함할 수 있습니다.'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>

        <Separator />

        {/* 버튼 */}
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-muted-foreground">
            {content.length} / 2000자
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!selectedMovieId || !title.trim() || !content.trim() || rating === 0}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Save className="size-4" />
              {editingPost ? '수정' : '발행'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}