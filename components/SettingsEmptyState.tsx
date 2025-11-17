import { Settings } from 'lucide-react';

export function SettingsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-4 rounded-full bg-muted/50 mb-4">
        <Settings className="size-12 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-center">
        표시할 설정 항목이 없습니다
      </p>
    </div>
  );
}
