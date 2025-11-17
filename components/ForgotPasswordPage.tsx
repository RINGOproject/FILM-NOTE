import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Popcorn, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordPageProps {
  onResetPassword: (email: string) => Promise<void>;
  onNavigateToLogin: () => void;
}

export function ForgotPasswordPage({ onResetPassword, onNavigateToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);
    try {
      await onResetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '비밀번호 재설정 요청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 popcorn-pattern">
      <div className="w-full max-w-md space-y-8">
        {/* 로고 섹션 */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Popcorn className="size-12 text-primary drop-shadow-lg" />
              <Sparkles className="size-4 absolute -top-1 -right-1 text-primary/70 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            FILM NOTE
          </h1>
          <p className="text-muted-foreground">
            영화관에서 만나는 리뷰 커뮤니티
          </p>
        </div>

        {/* 비밀번호 찾기 폼 */}
        <div className="bg-card border border-primary/20 rounded-lg p-6 sm:p-8 cinema-glow">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={onNavigateToLogin}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h2>비밀번호 찾기</h2>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="size-8 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-medium">이메일을 확인하세요</h3>
                  <p className="text-sm text-muted-foreground">
                    비밀번호 재설정 링크가 <span className="text-primary">{email}</span>로 전송되었습니다.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    이메일이 도착하지 않았다면 스팸 메일함을 확인해주세요.
                  </p>
                </div>
              </div>
              <Button
                onClick={onNavigateToLogin}
                className="w-full"
              >
                로그인으로 돌아가기
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
              </p>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-input-background"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? '전송 중...' : '재설정 링크 보내기'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <button
              onClick={onNavigateToLogin}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              로그인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
