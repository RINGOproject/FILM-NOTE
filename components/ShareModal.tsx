import { BlogPost } from '../types/movie';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { shareContent, isNativePlatform, triggerHaptic } from '../utils/capacitorInit';
import { 
  Share, 
  Copy, 
  MessageSquare,
  Mail,
  Link,
  Twitter,
  Facebook
} from 'lucide-react';

interface ShareModalProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareModal({ post, open, onOpenChange }: ShareModalProps) {
  if (!post) return null;

  const shareUrl = `https://filmnote.app/post/${post.id}`;
  const shareText = `${post.title} - ${post.summary || '영화 리뷰'}`;

  const copyToClipboardFallback = (text: string): boolean => {
    // Fallback method using textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (err) {
      document.body.removeChild(textarea);
      return false;
    }
  };

  const handleCopyLink = async () => {
    // Capacitor 햅틱 피드백
    await triggerHaptic('LIGHT');
    
    // Try Clipboard API first
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('링크가 복사되었습니다!');
        return;
      }
    } catch (error) {
      console.log('Clipboard API blocked, using fallback');
    }
    
    // Fallback to execCommand
    const success = copyToClipboardFallback(shareUrl);
    if (success) {
      toast.success('링크가 복사되었습니다!');
    } else {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  const handleKakaoShare = () => {
    // 실제 앱에서는 Kakao SDK를 사용
    window.open(
      `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      '_blank',
      'width=600,height=600'
    );
  };

  const handleGoogleShare = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(gmailUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md cinema-glow">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="size-5 text-primary" />
            리뷰 공유하기
          </DialogTitle>
          <DialogDescription>
            이 리뷰를 다양한 플랫폼에 공유해보세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 링크 복사 */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">링크 복사</h4>
            <div className="flex gap-2">
              <Input 
                value={shareUrl} 
                readOnly 
                className="flex-1 text-sm"
              />
              <Button onClick={handleCopyLink} className="gap-2">
                <Copy className="size-4" />
                복사
              </Button>
            </div>
          </div>

          {/* 소셜 미디어 공유 */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">SNS로 공유</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleKakaoShare}
                className="gap-2 h-12"
              >
                <MessageSquare className="size-5 text-yellow-500" />
                <span>카카오톡</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleGoogleShare}
                className="gap-2 h-12"
              >
                <Mail className="size-5 text-red-500" />
                <span>Gmail</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleTwitterShare}
                className="gap-2 h-12"
              >
                <Twitter className="size-5 text-blue-500" />
                <span>Twitter</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleFacebookShare}
                className="gap-2 h-12"
              >
                <Facebook className="size-5 text-blue-600" />
                <span>Facebook</span>
              </Button>
            </div>
          </div>

          {/* 네이티브 공유 (Capacitor + Web Share API) */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">
              {isNativePlatform() ? '네이티브 공유' : '기타'}
            </h4>
            <Button
              variant="outline"
              onClick={async () => {
                // Capacitor 햅틱 피드백
                await triggerHaptic('MEDIUM');
                
                // Capacitor/Web Share API 사용
                const shared = await shareContent(shareText, shareText, shareUrl);
                
                if (shared) {
                  toast.success('공유되었습니다!');
                  onOpenChange(false);
                } else {
                  // 공유 실패 시 링크 복사로 폴백
                  handleCopyLink();
                }
              }}
              className="w-full gap-2 h-12"
            >
              <Link className="size-5" />
              <span>{isNativePlatform() ? '앱으로 공유' : '기본 공유'}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
