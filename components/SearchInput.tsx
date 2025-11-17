import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './ui/utils';
import { Search, X, AlertCircle } from 'lucide-react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  state?: 'idle' | 'typing' | 'focused' | 'filled' | 'error' | 'disabled';
  helperText?: string;
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, state = 'idle', helperText, onClear, value, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {/* Search Icon */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          
          {/* Input */}
          <input
            type="text"
            ref={ref}
            value={value}
            className={cn(
              // Base styles
              "w-full h-11 pl-10 pr-10 rounded-lg transition-all duration-200",
              "text-sm placeholder:text-muted-foreground",
              "bg-input-background",
              
              // Idle state
              state === 'idle' && [
                "border border-primary/20",
                "focus:outline-none focus:border-primary/40"
              ],
              
              // Typing state
              state === 'typing' && [
                "border border-primary/30"
              ],
              
              // Focused state - border-color: color.accent, shadow-level.1
              state === 'focused' && [
                "border border-[#FFD700]",
                "shadow-md shadow-[#FFD700]/20",
                "outline-none"
              ],
              
              // Filled state
              state === 'filled' && [
                "border border-primary/30"
              ],
              
              // Error state - border-color: #FF5555
              state === 'error' && [
                "border border-[#FF5555]",
                "focus:border-[#FF5555]",
                "outline-none"
              ],
              
              // Disabled state
              state === 'disabled' && [
                "border border-primary/10",
                "bg-secondary/30 cursor-not-allowed",
                "text-muted-foreground/40"
              ],
              
              className
            )}
            disabled={state === 'disabled'}
            {...props}
          />
          
          {/* Clear Button (타이핑 중이거나 값이 있을 때만 표시) */}
          {value && state !== 'disabled' && onClear && (
            <button
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground hover:text-foreground transition-colors"
              type="button"
            >
              <X className="size-4" />
            </button>
          )}
          
          {/* Error Icon */}
          {state === 'error' && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#FF5555] pointer-events-none" />
          )}
        </div>
        
        {/* Helper Text (에러 상태에서만 표시) */}
        {state === 'error' && helperText && (
          <p className="mt-1.5 text-xs text-[#FF5555] pl-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
