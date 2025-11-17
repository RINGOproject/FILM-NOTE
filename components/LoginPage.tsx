import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Film, Popcorn } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onNavigateToSignup: () => void;
  onNavigateToFindId: () => void;
  onNavigateToForgotPassword: () => void;
}

export function LoginPage({ 
  onLogin, 
  onNavigateToSignup,
  onNavigateToFindId,
  onNavigateToForgotPassword
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-800 via-slate-900 to-slate-950 overflow-hidden relative">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md text-center space-y-4 sm:space-y-5">
          {/* Logo at top */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Film className="size-6 sm:size-7 text-primary drop-shadow-lg" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground drop-shadow-lg">
              FILM NOTE
            </h1>
          </div>

          {/* Popcorn Image - centered and responsive */}
          <div className="flex justify-center mb-2 sm:mb-3">
            <Popcorn 
              className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 text-primary drop-shadow-[0_0_60px_rgba(251,191,36,0.6)]"
              style={{
                filter: 'drop-shadow(0 10px 40px rgba(251, 191, 36, 0.5)) drop-shadow(0 0 25px rgba(251, 191, 36, 0.4))'
              }}
            />
          </div>

          {/* Headline */}
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-white leading-tight">
              당신의 다음{' '}
              <span className="text-primary">최애 영화</span>가
              <br />
              기다리고 있습니다.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base md:text-base px-2 sm:px-4 leading-relaxed">
              최신 영화와 시리즈에 대한 생각을
              <br />
              발견하고, 리뷰하고, 공유하세요.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4">
            <Button 
              onClick={onNavigateToSignup}
              className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-slate-900 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300"
            >
              회원가입
            </Button>
            
            <Button 
              onClick={() => setLoginModalOpen(true)}
              variant="outline"
              className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold bg-slate-700/50 hover:bg-slate-700 text-white border-slate-600 rounded-xl transition-all duration-300"
            >
              로그인
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-3 border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs sm:text-xs text-slate-400">
            © 2025 FILM NOTE. 모든 영화 애호가를 위한 플랫폼
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="sm:max-w-md cinema-modal-glow border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">로그인</DialogTitle>
            <DialogDescription className="text-center">
              이메일과 비밀번호를 입력하세요
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-input-background border-primary/20 focus:border-primary/40"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-input-background border-primary/20 focus:border-primary/40"
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setLoginModalOpen(false);
                  onNavigateToFindId();
                }}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                아이디 찾기
              </button>
              <span className="text-muted-foreground hidden sm:inline">|</span>
              <button
                type="button"
                onClick={() => {
                  setLoginModalOpen(false);
                  onNavigateToForgotPassword();
                }}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                비밀번호 재설정
              </button>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
              계정이 없으신가요?{' '}
              <button
                type="button"
                onClick={() => {
                  setLoginModalOpen(false);
                  onNavigateToSignup();
                }}
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                회원가입하기
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
