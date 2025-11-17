import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Plus, X, Check, Tv } from 'lucide-react';

interface PlatformManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlatforms: string[];
  onSave: (platforms: string[]) => void;
}

const availablePlatforms = [
  'Netflix',
  'Disney+',
  'Amazon Prime',
  'Apple TV+',
  'Wavve',
  'Tving',
  'Watcha',
  'Coupang Play',
  'Mubi',
  'HBO Max',
  'Hulu',
  'Paramount+',
  'Peacock',
  'YouTube Premium'
];

export function PlatformManagerModal({
  open,
  onOpenChange,
  currentPlatforms,
  onSave
}: PlatformManagerModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(currentPlatforms);
  const [customPlatform, setCustomPlatform] = useState('');

  const handleTogglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleAddCustomPlatform = () => {
    if (customPlatform.trim() && !selectedPlatforms.includes(customPlatform.trim())) {
      setSelectedPlatforms(prev => [...prev, customPlatform.trim()]);
      setCustomPlatform('');
    }
  };

  const handleRemoveCustomPlatform = (platform: string) => {
    if (!availablePlatforms.includes(platform)) {
      setSelectedPlatforms(prev => prev.filter(p => p !== platform));
    }
  };

  const handleSave = () => {
    onSave(selectedPlatforms);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedPlatforms(currentPlatforms);
    setCustomPlatform('');
    onOpenChange(false);
  };

  const customPlatforms = selectedPlatforms.filter(p => !availablePlatforms.includes(p));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] cinema-glow">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tv className="size-5 text-primary" />
            OTT 플랫폼 관리
          </DialogTitle>
          <DialogDescription>
            이용 중인 OTT 플랫폼을 선택하여 프로필에 표시하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 선택된 플랫폼 표시 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">선택된 플랫폼</h4>
              <Badge variant="secondary" className="gap-1">
                <Check className="size-3" />
                {selectedPlatforms.length}개
              </Badge>
            </div>
            
            {selectedPlatforms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedPlatforms.map((platform) => (
                  <Badge
                    key={platform}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {platform}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleTogglePlatform(platform)}
                    >
                      <X className="size-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">선택된 플랫폼이 없습니다.</p>
            )}
          </div>

          {/* 기본 플랫폼 선택 */}
          <div>
            <h4 className="font-medium mb-3">기본 플랫폼</h4>
            <ScrollArea className="h-48 border rounded-lg p-3">
              <div className="space-y-2">
                {availablePlatforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform);
                  
                  return (
                    <div
                      key={platform}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleTogglePlatform(platform)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleTogglePlatform(platform)}
                      />
                      <span className="flex-1">{platform}</span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* 커스텀 플랫폼 추가 */}
          <div>
            <h4 className="font-medium mb-3">커스텀 플랫폼 추가</h4>
            <div className="flex gap-2">
              <Input
                placeholder="플랫폼 이름 입력..."
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomPlatform()}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddCustomPlatform}
                disabled={!customPlatform.trim()}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            
            {customPlatforms.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">추가된 커스텀 플랫폼:</p>
                <div className="flex flex-wrap gap-2">
                  {customPlatforms.map((platform) => (
                    <Badge
                      key={platform}
                      variant="outline"
                      className="gap-1 pr-1 border-primary/50"
                    >
                      {platform}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveCustomPlatform(platform)}
                      >
                        <X className="size-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedPlatforms.length}개 플랫폼 선택됨
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Check className="size-4" />
                저장
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}