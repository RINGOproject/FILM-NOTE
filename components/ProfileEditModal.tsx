import { useState } from 'react';
import { UserProfile } from '../types/movie';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Camera, Save, X } from 'lucide-react';

interface ProfileEditModalProps {
  user: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userData: Partial<UserProfile>) => void;
}

export function ProfileEditModal({ user, open, onOpenChange, onSave }: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || '',
    avatar: user.avatar
  });

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      bio: user.bio || '',
      avatar: user.avatar
    });
    onOpenChange(false);
  };

  // 아바타 이미지 목록 (예시)
  const avatarOptions = [
    'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=150&h=150&fit=crop&crop=face'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md cinema-glow">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="size-5 text-primary" />
            프로필 수정
          </DialogTitle>
          <DialogDescription>
            프로필 사진과 소개를 변경할 수 있습니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 현재 프로필 사진 */}
          <div className="text-center space-y-4">
            <Avatar className="size-24 mx-auto ring-4 ring-primary/20">
              <AvatarImage src={formData.avatar} alt={formData.name} />
              <AvatarFallback className="text-2xl">{formData.name[0]}</AvatarFallback>
            </Avatar>
            
            <div>
              <Label className="text-sm font-medium">프로필 사진 선택</Label>
              <div className="grid grid-cols-4 gap-3 mt-2">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                    className={`relative rounded-full overflow-hidden transition-all ${
                      formData.avatar === avatar 
                        ? 'ring-2 ring-primary scale-110' 
                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar option ${index + 1}`}
                      className="size-12 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* 이름 */}
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="이름을 입력하세요"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">
              {formData.name.length}/20
            </p>
          </div>

          {/* 한 줄 소개 */}
          <div className="space-y-2">
            <Label htmlFor="bio">한 줄 소개</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="자신을 소개하는 한 줄을 작성해보세요"
              className="min-h-20 resize-none"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {formData.bio.length}/100
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              <X className="size-4 mr-2" />
              취소
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 gap-2"
              disabled={!formData.name.trim()}
            >
              <Save className="size-4" />
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}