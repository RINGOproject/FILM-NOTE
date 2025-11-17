import { useState } from 'react';
import { AlertTriangle, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

interface SpoilerContentProps {
  content?: string;
  isBlurred?: boolean;
  children?: React.ReactNode;
  pros?: string[];
  cons?: string[];
  showWarningOverlay?: boolean;
  onReveal?: () => void;
  limitHeight?: boolean;
}

export function SpoilerContent({ 
  content, 
  isBlurred = true, 
  children, 
  pros, 
  cons,
  showWarningOverlay = false,
  onReveal,
  limitHeight = false
}: SpoilerContentProps) {
  const [isRevealed, setIsRevealed] = useState(!isBlurred);
  const [showWarning, setShowWarning] = useState(false);

  const handleRevealClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isRevealed) {
      setShowWarning(true);
    } else {
      setIsRevealed(false);
    }
  };

  const confirmReveal = () => {
    setIsRevealed(true);
    setShowWarning(false);
    onReveal?.();
  };

  const cancelReveal = () => {
    setShowWarning(false);
  };

  // 경고 다이얼로그
  if (showWarning) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          {/* 중앙 경고 아이콘 */}
          <div className="relative">
            <div className="size-24 mx-auto rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mb-4">
              <AlertTriangle className="size-12 text-destructive animate-pulse" />
            </div>
            {/* 글로우 효과 */}
            <div className="absolute inset-0 size-24 mx-auto rounded-full bg-destructive/20 blur-xl -z-10" />
          </div>
          
          {/* 제목 */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-destructive">⚠️ 스포일러 주의</h2>
            <div className="w-16 h-0.5 bg-destructive/50 mx-auto rounded-full" />
          </div>
          
          {/* 설명 */}
          <Alert className="border-destructive/30 bg-destructive/5 text-left">
            <AlertDescription className="text-sm leading-relaxed text-center">
              이 리뷰에는 영화의 <span className="font-medium text-destructive">핵심 스토리와 결말</span>이 포함되어 있습니다.<br />
              영화를 아직 감상하지 않으셨다면 신중히 선택해주세요.
            </AlertDescription>
          </Alert>
          
          {/* 버튼 */}
          <div className="flex flex-col gap-3 pt-2">
            <Button 
              variant="destructive" 
              onClick={confirmReveal} 
              className="gap-2 shadow-lg w-full"
              size="lg"
            >
              <Eye className="size-5" />
              스포일러 보기
            </Button>
            <Button 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                cancelReveal();
              }} 
              className="gap-2 w-full border-muted-foreground/30 hover:bg-muted/50"
              size="lg"
            >
              <Shield className="size-5" />
              안전하게 나가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {!isRevealed && isBlurred ? (
        <div className="space-y-4">
          {/* 개선된 블러 처리된 컨텐츠 */}
          <div className={`relative rounded-lg overflow-hidden group ${limitHeight ? 'max-h-[100px]' : ''}`}>
            {/* 블러된 배경 */}
            <div 
              className="relative filter blur-sm select-none transition-all duration-300 group-hover:blur-md"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
              }}
            >
              {children || (
                <div className="prose prose-sm max-w-none text-muted-foreground p-6">
                  <p>{content}</p>
                  {pros && pros.length > 0 && (
                    <div className="mt-4">
                      <h4>좋았던 점</h4>
                      <ul>
                        {pros.map((pro, index) => (
                          <li key={index}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cons && cons.length > 0 && (
                    <div className="mt-4">
                      <h4>아쉬웠던 점</h4>
                      <ul>
                        {cons.map((con, index) => (
                          <li key={index}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/30 to-background/60" />
            
            {/* 중앙 경고 표시 */}
            {showWarningOverlay && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="bg-background/95 backdrop-blur-sm border border-destructive/30 rounded-lg p-4 sm:p-6 text-center shadow-2xl max-w-sm w-full">
                  <AlertTriangle className="size-8 sm:size-12 text-destructive mx-auto mb-2 sm:mb-3 animate-pulse" />
                  <h3 className="font-semibold text-destructive mb-1 sm:mb-2 text-sm sm:text-base">스포일러 내용</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                    영화의 핵심 내용이 포함되어 있습니다
                  </p>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleRevealClick}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Eye className="size-4" />
                    내용 보기
                  </Button>
                </div>
              </div>
            )}
            
            {/* 클릭 가능한 영역 */}
            {!showWarningOverlay && (
              <div 
                className="absolute inset-0 cursor-pointer transition-all duration-300 hover:bg-primary/5"
                onClick={(e) => handleRevealClick(e)}
              />
            )}
          </div>
          
          {/* 하단 버튼 (경고 오버레이가 없을 때만 표시) */}
          {!showWarningOverlay && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => handleRevealClick(e)}
                className="gap-2 bg-background/80 backdrop-blur-sm border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <AlertTriangle className="size-4" />
                스포일러 내용 보기
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {children || (
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>{content}</p>
            </div>
          )}
          
          {isBlurred && (
            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRevealClick}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <EyeOff className="size-4" />
                스포일러 숨기기
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}