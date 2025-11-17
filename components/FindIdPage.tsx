import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Popcorn, Sparkles, ArrowLeft, Mail } from 'lucide-react';

interface FindIdPageProps {
  onFindId: (name: string, phone: string) => Promise<string>;
  onNavigateToLogin: () => void;
}

export function FindIdPage({ onFindId, onNavigateToLogin }: FindIdPageProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundEmail, setFoundEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFoundEmail('');
    
    if (!name || !phone) {
      setError('이름과 전화번호를 입력해주세요.');
      return;
    }

    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phoneRegex.test(phone.replace(/-/g, ''))) {
      setError('올바른 전화번호 형식이 아닙니다.');
      return;
    }

    setLoading(true);
    try {
      const email = await onFindId(name, phone);
      setFoundEmail(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : '아이디 찾기에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
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

        {/* 아이디 찾기 폼 */}
        <div className="bg-card border border-primary/20 rounded-lg p-6 sm:p-8 cinema-glow">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={onNavigateToLogin}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h2>아이디 찾기</h2>
          </div>

          {foundEmail ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="size-8 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-medium">아이디를 찾았습니다</h3>
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <p className="text-sm text-muted-foreground mb-1">등록된 이메일</p>
                    <p className="text-lg text-primary font-medium">{foundEmail}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    해당 이메일로 로그인하실 수 있습니다.
                  </p>
                </div>
              </div>
              <Button
                onClick={onNavigateToLogin}
                className="w-full"
              >
                로그인하기
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                가입 시 등록한 이름과 전화번호를 입력하세요.
              </p>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="bg-input-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={handlePhoneChange}
                  disabled={loading}
                  className="bg-input-background"
                  maxLength={13}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? '찾는 중...' : '아이디 찾기'}
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
