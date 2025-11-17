import { ChevronRight } from 'lucide-react';
import { Switch } from './ui/switch';

interface SettingItemProps {
  label: string;
  type: 'switch' | 'dropdown' | 'link';
  state?: 'default' | 'pressed' | 'disabled';
  value?: boolean | string;
  onChange?: (value: boolean | string) => void;
  onClick?: () => void;
  description?: string;
}

export function SettingItem({
  label,
  type,
  state = 'default',
  value,
  onChange,
  onClick,
  description
}: SettingItemProps) {
  const isDisabled = state === 'disabled';
  const isPressed = state === 'pressed';

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`
        flex items-center justify-between h-14 px-4
        ${type === 'link' ? 'cursor-pointer hover:bg-muted/50' : ''}
        ${isPressed ? 'bg-muted' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        transition-colors
      `}
      onClick={type === 'link' ? handleClick : undefined}
    >
      <div className="flex-1">
        <div className="text-sm">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-1">{description}</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {type === 'switch' && (
          <Switch
            checked={value as boolean}
            onCheckedChange={(checked) => onChange?.(checked)}
            disabled={isDisabled}
            className="data-[state=checked]:bg-primary"
          />
        )}

        {type === 'dropdown' && (
          <div className="flex items-center gap-2">
            {value && <span className="text-sm text-muted-foreground">{value}</span>}
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        )}

        {type === 'link' && (
          <ChevronRight className="size-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
