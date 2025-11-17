import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface SettingsErrorStateProps {
  onRetry: () => void;
}

export function SettingsErrorState({ onRetry }: SettingsErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-4 rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="size-12 text-destructive" />
      </div>
      <p className="text-muted-foreground text-center mb-4">
        설정 정보를 불러오지 못했습니다
      </p>
      <Button onClick={onRetry} variant="outline">
        재시도
      </Button>
    </div>
  );
}
