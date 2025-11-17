import { Badge } from './ui/badge';
import { Award, Glasses, Popcorn } from 'lucide-react';

interface VerificationBadgeProps {
  level: 'popcorn' | 'glasses' | 'pro' | false;
  size?: 'sm' | 'md';
}

export function VerificationBadge({ level, size = 'md' }: VerificationBadgeProps) {
  if (!level) return null;

  const configs = {
    popcorn: {
      icon: Popcorn,
      label: '아마추어 평론가',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      description: '팔로워 200+'
    },
    glasses: {
      icon: Glasses,
      label: '평론가',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      description: '팔로워 1000+'
    },
    pro: {
      icon: Award,
      label: '전문 평론가',
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      description: '팔로워 5000+'
    }
  };

  const config = configs[level];
  const IconComponent = config.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1';

  return (
    <Badge 
      className={`${config.color} ${sizeClasses} gap-1 font-medium border`}
      title={`${config.label} (${config.description})`}
    >
      <IconComponent className="size-4" />
      <span className="hidden sm:inline">{config.label}</span>
    </Badge>
  );
}
