import { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { 
  MoreHorizontal, 
  EyeOff, 
  Flag, 
  AlertTriangle,
  UserX,
  Trash2,
  Edit
} from 'lucide-react';

interface MoreOptionsMenuProps {
  onHide?: () => void;
  onBlock?: () => void;
  onReport?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  showDelete?: boolean;
  isOwnContent?: boolean;
  className?: string;
}

export function MoreOptionsMenu({ onHide, onBlock, onReport, onDelete, onEdit, showDelete = false, isOwnContent = false, className }: MoreOptionsMenuProps) {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showHideDialog, setShowHideDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHideDialog(true);
  };

  const handleBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBlockDialog(true);
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReportDialog(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const confirmHide = () => {
    onHide?.();
    setShowHideDialog(false);
  };

  const confirmBlock = () => {
    onBlock?.();
    setShowBlockDialog(false);
  };

  const confirmReport = () => {
    onReport?.();
    setShowReportDialog(false);
  };

  const confirmDelete = () => {
    onDelete?.();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`size-8 p-0 ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 본인 콘텐츠인 경우 */}
          {isOwnContent && (
            <>
              {onEdit && (
                <DropdownMenuItem 
                  onClick={handleEdit} 
                  className="gap-2 cursor-pointer"
                >
                  <Edit className="size-4" />
                  <span>수정하기</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={handleDelete} 
                className="gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4" />
                <span>삭제하기</span>
              </DropdownMenuItem>
            </>
          )}
          
          {/* 타인 콘텐츠인 경우 */}
          {!isOwnContent && (
            <>
              {showDelete && (
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-4" />
                  <span>삭제하기</span>
                </DropdownMenuItem>
              )}
              {!showDelete && (
                <DropdownMenuItem onClick={handleHide} className="gap-2 cursor-pointer">
                  <EyeOff className="size-4" />
                  <span>숨기기</span>
                </DropdownMenuItem>
              )}
              {onBlock && !showDelete && (
                <DropdownMenuItem 
                  onClick={handleBlock} 
                  className="gap-2 cursor-pointer text-orange-500 focus:text-orange-500"
                >
                  <UserX className="size-4" />
                  <span>차단</span>
                </DropdownMenuItem>
              )}
              {!showDelete && (
                <DropdownMenuItem 
                  onClick={handleReport} 
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <Flag className="size-4" />
                  <span>신고하기</span>
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 숨기기 확인 다이얼로그 */}
      <AlertDialog open={showHideDialog} onOpenChange={setShowHideDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글 숨기기</AlertDialogTitle>
            <AlertDialogDescription>
              이 게시글을 피드에서 숨기시겠습니까? 나중에 숨김 해제할 수 있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmHide}>숨기기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 차단 확인 다이얼로그 */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserX className="size-5 text-orange-500" />
              사용자 차단
            </AlertDialogTitle>
            <AlertDialogDescription>
              이 사용자를 차단하시겠습니까? 차단하면 이 사용자의 게시글과 댓글을 더 이상 볼 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBlock} className="bg-orange-500 text-white hover:bg-orange-600">
              차단하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 신고 확인 다이얼로그 */}
      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Flag className="size-5 text-destructive" />
              게시글 신고
            </AlertDialogTitle>
            <AlertDialogDescription>
              이 게시글이 커뮤니티 가이드라인을 위반한다고 생각하시나요? 
              신고해주시면 검토 후 적절한 조치를 취하겠습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReport} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              신고하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="size-5 text-destructive" />
              {isOwnContent ? '리뷰 삭제' : '댓글 삭제'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 {isOwnContent ? '리뷰' : '댓글'}을 삭제하시겠습니까? 
              삭제된 {isOwnContent ? '리뷰' : '댓글'}는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}