import { useState } from 'react';
import { ArrowLeft, Settings as SettingsIcon, AlertTriangle, Film } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { SettingItem } from './SettingItem';
import { SettingsLoadingState } from './SettingsLoadingState';
import { SettingsErrorState } from './SettingsErrorState';
import { SettingsEmptyState } from './SettingsEmptyState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

interface SettingsPageProps {
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
  onLogout: () => void;
  onBack: () => void;
  currentUserId?: string;
  onDeleteAccount: () => void;
}

export function SettingsPage({
  isDarkMode,
  onToggleDarkMode,
  onLogout,
  onBack,
  currentUserId,
  onDeleteAccount
}: SettingsPageProps) {
  const [loading] = useState(false);
  const [error] = useState(false);
  
  // 알림 설정 상태
  const [pushNotification, setPushNotification] = useState(true);
  const [ottNotification, setOttNotification] = useState(true);
  const [commentNotification, setCommentNotification] = useState(true);
  
  // 표시 설정 상태
  const [fontSize, setFontSize] = useState('기본');
  
  // 다이얼로그 상태
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [profileEditDialogOpen, setProfileEditDialogOpen] = useState(false);
  const [passwordChangeDialogOpen, setPasswordChangeDialogOpen] = useState(false);
  const [loginHistoryDialogOpen, setLoginHistoryDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1: 1차 확인, 2: 비밀번호, 3: 사유, 4: 완료
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteReasonDetail, setDeleteReasonDetail] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteReasons = [
    '서비스 이용 빈도가 낮음',
    '콘텐츠 불만족',
    '개인정보 우려',
    '다른 서비스로 이동',
    '기타'
  ];

  const handleDeleteDialogClose = () => {
    setDeleteAccountDialogOpen(false);
    setDeleteStep(1);
    setDeletePassword('');
    setDeleteReason('');
    setDeleteReasonDetail('');
  };

  const handleDeleteStep1Next = () => {
    setDeleteStep(2);
  };

  const handleDeleteStep2Next = () => {
    if (!deletePassword.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    // 비밀번호 검증은 실제 탈퇴 시 서버에서 수행
    setDeleteStep(3);
  };

  const handleDeleteStep3Next = () => {
    if (!deleteReason) {
      alert('탈퇴 사유를 선택해주세요.');
      return;
    }
    if (deleteReason === '기타' && !deleteReasonDetail.trim()) {
      alert('탈퇴 사유를 입력해주세요.');
      return;
    }
    handleFinalDelete();
  };

  const handleFinalDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteAccount();
      setDeleteStep(4);
      // 3초 후 자동으로 닫기
      setTimeout(() => {
        handleDeleteDialogClose();
      }, 3000);
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="size-4" />
              </Button>
              <div className="flex items-center gap-2">
                <SettingsIcon className="size-5 text-primary" />
                <h1 className="text-xl">설정</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <SettingsLoadingState />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="size-4" />
              </Button>
              <div className="flex items-center gap-2">
                <SettingsIcon className="size-5 text-primary" />
                <h1 className="text-xl">설정</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <SettingsErrorState onRetry={() => window.location.reload()} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <SettingsIcon className="size-5 text-primary" />
              <h1 className="text-xl">설정</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* 계정 섹션 */}
          <section>
            <h2 className="px-4 mb-2">계정</h2>
            <div className="bg-card rounded-lg border border-border/50 divide-y divide-border/50">
              <SettingItem
                label="프로필 수정"
                type="link"
                onClick={() => setProfileEditDialogOpen(true)}
              />
              <SettingItem
                label="비밀번호 변경"
                type="link"
                onClick={() => setPasswordChangeDialogOpen(true)}
              />
              <SettingItem
                label="로그인 기록 보기"
                type="link"
                onClick={() => setLoginHistoryDialogOpen(true)}
              />
            </div>
          </section>

          {/* 알림 섹션 */}
          <section>
            <h2 className="px-4 mb-2">알림</h2>
            <div className="bg-card rounded-lg border border-border/50 divide-y divide-border/50">
              <SettingItem
                label="앱 푸시 알림"
                type="switch"
                value={pushNotification}
                onChange={(value) => setPushNotification(value as boolean)}
              />
              <SettingItem
                label="OTT 새 콘텐츠 알림"
                type="switch"
                value={ottNotification}
                onChange={(value) => setOttNotification(value as boolean)}
              />
              <SettingItem
                label="리뷰 댓글 알림"
                type="switch"
                value={commentNotification}
                onChange={(value) => setCommentNotification(value as boolean)}
              />
            </div>
          </section>

          {/* 표시 섹션 */}
          <section>
            <h2 className="px-4 mb-2">표시</h2>
            <div className="bg-card rounded-lg border border-border/50 divide-y divide-border/50">
              <SettingItem
                label="다크모드"
                type="switch"
                value={isDarkMode}
                onChange={onToggleDarkMode}
              />
              <div className="flex items-center justify-between h-14 px-4">
                <div className="text-sm">글자 크기</div>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="작게">작게</SelectItem>
                    <SelectItem value="기본">기본</SelectItem>
                    <SelectItem value="크게">크게</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* 정보 섹션 */}
          <section>
            <h2 className="px-4 mb-2">정보</h2>
            <div className="bg-card rounded-lg border border-border/50 divide-y divide-border/50">
              <SettingItem
                label="서비스 이용약관"
                type="link"
                onClick={() => setTermsDialogOpen(true)}
              />
              <SettingItem
                label="개인정보 처리방침"
                type="link"
                onClick={() => setPrivacyDialogOpen(true)}
              />
              <SettingItem
                label="버전 정보"
                type="link"
                onClick={() => setVersionDialogOpen(true)}
              />
            </div>
          </section>

          {/* 회원탈퇴 섹션 */}
          <section>
            <h2 className="px-4 mb-2">계정 관리</h2>
            <div className="bg-card rounded-lg border border-destructive/30 divide-y divide-border/50">
              <SettingItem
                label="회원탈퇴"
                type="link"
                onClick={() => setDeleteAccountDialogOpen(true)}
              />
            </div>
            <p className="px-4 mt-2 text-xs text-muted-foreground">
              회원탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 pb-safe">
          <div className="container mx-auto px-4 py-6 max-w-2xl text-center space-y-4">
            <div className="text-sm text-muted-foreground">v1.0.0</div>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              로그아웃
            </Button>
          </div>
        </footer>
      </main>

      {/* 다이얼로그들 */}
      <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>서비스 이용약관</DialogTitle>
            <DialogDescription>
              FILM NOTE 서비스 이용약관입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-4 text-sm">
            <p>제1조 (목적)</p>
            <p className="text-muted-foreground">
              본 약관은 FILM NOTE가 제공하는 영화 리뷰 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
            <p>제2조 (정의)</p>
            <p className="text-muted-foreground">
              "서비스"란 FILM NOTE가 제공하는 영화 정보, 리뷰, 커뮤니티 등 모든 서비스를 의미합니다.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>개인정보 처리방침</DialogTitle>
            <DialogDescription>
              FILM NOTE 개인정보 처리방침입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-4 text-sm">
            <p>제1조 (개인정보의 수집 항목 및 방법)</p>
            <p className="text-muted-foreground">
              회사는 회원가입, 서비스 제공 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
            </p>
            <p className="text-muted-foreground">
              - 필수항목: 이메일, 비밀번호, 이름
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={versionDialogOpen} onOpenChange={setVersionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>버전 정보</DialogTitle>
            <DialogDescription>
              FILM NOTE v1.0.0
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-2">업데이트 내용</p>
              <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                <li>영화 검색 및 필터링 기능</li>
                <li>블로그 리뷰 작성 기능</li>
                <li>사용자 프로필 시스템</li>
                <li>팔로우/팔로잉 기능</li>
                <li>스포일러 블러 처리</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={profileEditDialogOpen} onOpenChange={setProfileEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프로필 수정</DialogTitle>
            <DialogDescription>
              프로필 정보를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground text-center py-8">
            프로필 수정 기능은 곧 제공될 예정입니다.
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordChangeDialogOpen} onOpenChange={setPasswordChangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>비밀번호 변경</DialogTitle>
            <DialogDescription>
              새로운 비밀번호를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground text-center py-8">
            비밀번호 변경 기능은 곧 제공될 예정입니다.
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={loginHistoryDialogOpen} onOpenChange={setLoginHistoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>로그인 기록</DialogTitle>
            <DialogDescription>
              최근 로그인 기록을 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground text-center py-8">
            로그인 기록 기능은 곧 제공될 예정입니다.
          </div>
        </DialogContent>
      </Dialog>

      {/* 회원탈퇴 다이얼로그 */}
      <Dialog open={deleteAccountDialogOpen} onOpenChange={(open) => {
        if (!open && deleteStep !== 4) {
          handleDeleteDialogClose();
        }
      }}>
        <DialogContent className="max-w-md">
          {deleteStep === 1 && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="size-8 text-destructive" />
                  </div>
                </div>
                <DialogTitle className="text-center">정말 탈퇴하시겠습니까?</DialogTitle>
                <DialogDescription className="text-center">
                  탈퇴하시면 모든 데이터가 영구적으로 삭제되며<br />
                  복구할 수 없습니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <p className="text-muted-foreground">삭제되는 데이터:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>프로필 정보</li>
                    <li>작성한 모든 리뷰 및 댓글</li>
                    <li>작성한 블로그 포스트</li>
                    <li>팔로우/팔로잉 관계</li>
                  </ul>
                </div>
              </div>
              <DialogFooter className="flex-row gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={handleDeleteDialogClose}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteStep1Next}
                  className="flex-1"
                >
                  계속하기
                </Button>
              </DialogFooter>
            </>
          )}

          {deleteStep === 2 && (
            <>
              <DialogHeader>
                <DialogTitle>본인 확인</DialogTitle>
                <DialogDescription>
                  보안을 위해 현재 비밀번호를 입력해주세요.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="delete-password">현재 비밀번호</Label>
                  <Input
                    id="delete-password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleDeleteStep2Next();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter className="flex-row gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteStep(1)}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button
                  onClick={handleDeleteStep2Next}
                  className="flex-1"
                >
                  다음
                </Button>
              </DialogFooter>
            </>
          )}

          {deleteStep === 3 && (
            <>
              <DialogHeader>
                <DialogTitle>탈퇴 사유를 알려주세요</DialogTitle>
                <DialogDescription>
                  더 나은 서비스를 위해 탈퇴 사유를 수집하고 있습니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <RadioGroup value={deleteReason} onValueChange={setDeleteReason}>
                  {deleteReasons.map((reason) => (
                    <div key={reason} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason} id={reason} />
                      <Label htmlFor={reason} className="cursor-pointer">
                        {reason}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {deleteReason === '기타' && (
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="delete-reason-detail">상세 사유</Label>
                    <Textarea
                      id="delete-reason-detail"
                      placeholder="탈퇴 사유를 입력해주세요"
                      value={deleteReasonDetail}
                      onChange={(e) => setDeleteReasonDetail(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
              </div>
              <DialogFooter className="flex-row gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteStep(2)}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  이전
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteStep3Next}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  {isDeleting ? '탈퇴 처리 중...' : '탈퇴하기'}
                </Button>
              </DialogFooter>
            </>
          )}

          {deleteStep === 4 && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Film className="size-10 text-primary" />
                  </div>
                </div>
                <DialogTitle className="text-center text-xl">
                  하나의 필름이 막을 내립니다
                </DialogTitle>
              </DialogHeader>
              <div className="py-6 text-center space-y-4">
                <p className="text-muted-foreground">
                  당신의 빛나는 다음 씬을 응원하겠습니다.
                </p>
                <p className="text-muted-foreground">
                  함께해 주셔서 감사합니다.
                </p>
                <div className="pt-4 flex items-center justify-center gap-1 text-primary">
                  <div className="size-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="size-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '200ms' }} />
                  <div className="size-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
