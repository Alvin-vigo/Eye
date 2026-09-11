import { useEffect, useState } from 'react';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { User, Key, Save, Edit3, X, Check } from 'lucide-react';
import { Button } from '@client/src/components/ui/button';
import { Input } from '@client/src/components/ui/input';
import { Label } from '@client/src/components/ui/label';
import { authApi } from '@client/src/api';
import type { UserInfo } from '@shared/api.interface';

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<UserInfo | null>(null);

  // 昵称编辑
  const [editingNickname, setEditingNickname] = useState<boolean>(false);
  const [nicknameInput, setNicknameInput] = useState<string>('');
  const [nicknameSaving, setNicknameSaving] = useState<boolean>(false);
  const [nicknameMsg, setNicknameMsg] = useState<string>('');

  // 修改密码
  const [currentPwd, setCurrentPwd] = useState<string>('');
  const [newPwd, setNewPwd] = useState<string>('');
  const [confirmPwd, setConfirmPwd] = useState<string>('');
  const [pwdSaving, setPwdSaving] = useState<boolean>(false);
  const [pwdMsg, setPwdMsg] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await authApi.getCurrentUser();
        if (!cancelled) {
          setUser(result.user);
          setNicknameInput(result.user.nickname || '');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(`ProfilePage load failed: ${msg}`);
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveNickname = async () => {
    try {
      setNicknameSaving(true);
      setNicknameMsg('');
      // 演示版：模拟保存，直接更新本地状态
      if (user) {
        setUser({ ...user, nickname: nicknameInput || null });
      }
      setEditingNickname(false);
      setNicknameMsg('昵称已更新');
      setTimeout(() => setNicknameMsg(''), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`ProfilePage save nickname failed: ${msg}`);
      setNicknameMsg(`保存失败：${msg}`);
    } finally {
      setNicknameSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setNicknameInput(user?.nickname || '');
    setEditingNickname(false);
    setNicknameMsg('');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdMsg('请填写所有密码字段');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg('两次输入的新密码不一致');
      return;
    }
    if (newPwd.length < 6) {
      setPwdMsg('新密码长度不能少于 6 位');
      return;
    }
    try {
      setPwdSaving(true);
      setPwdMsg('');
      // 演示版：模拟保存
      await new Promise((resolve) => setTimeout(resolve, 600));
      setPwdMsg('密码修改成功');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setTimeout(() => setPwdMsg(''), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`ProfilePage change password failed: ${msg}`);
      setPwdMsg(`修改失败：${msg}`);
    } finally {
      setPwdSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="space-y-6 p-6">
        <p className="text-muted-foreground">加载中...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="space-y-6 p-6">
        <p className="text-destructive">加载失败：{error}</p>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">
      <section>
        <h1 className="text-2xl font-bold text-foreground">个人资料</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          管理您的账号信息
        </p>
      </section>

      {/* 资料卡片 */}
      <section
        className="rounded-xl border border-border bg-card p-6"
        aria-labelledby="profile-heading"
      >
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2
            id="profile-heading"
            className="text-lg font-semibold text-foreground"
          >
            账号信息
          </h2>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <Label className="text-sm text-muted-foreground">账号</Label>
            <p className="mt-1 font-medium text-foreground">
              {user?.account}
            </p>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">昵称</Label>
            {editingNickname ? (
              <div className="mt-1 flex items-center gap-2">
                <Input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  aria-label="昵称输入"
                  className="max-w-xs"
                />
                <Button
                  size="sm"
                  onClick={handleSaveNickname}
                  disabled={nicknameSaving}
                  aria-label="保存昵称"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {nicknameSaving ? '保存中' : '保存'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  aria-label="取消编辑昵称"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  取消
                </Button>
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-2">
                <p className="font-medium text-foreground">
                  {user?.nickname || '未设置昵称'}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingNickname(true)}
                  aria-label="编辑昵称"
                >
                  <Edit3 className="h-4 w-4" aria-hidden="true" />
                  编辑
                </Button>
              </div>
            )}
            {nicknameMsg && (
              <p
                className={`mt-1 text-xs ${
                  nicknameMsg.startsWith('保存失败')
                    ? 'text-destructive'
                    : 'text-success'
                }`}
                role="status"
              >
                {nicknameMsg}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">注册时间</Label>
            <p className="mt-1 font-medium text-foreground">演示账号</p>
          </div>
        </div>
      </section>

      {/* 修改密码区域 */}
      <section
        className="rounded-xl border border-border bg-card p-6"
        aria-labelledby="password-heading"
      >
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2
            id="password-heading"
            className="text-lg font-semibold text-foreground"
          >
            修改密码
          </h2>
        </div>

        <form
          onSubmit={handleChangePassword}
          className="mt-5 space-y-4 max-w-md"
        >
          <div>
            <Label htmlFor="current-password" className="text-sm">
              当前密码
            </Label>
            <Input
              id="current-password"
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="mt-1"
              autoComplete="current-password"
            />
          </div>

          <div>
            <Label htmlFor="new-password" className="text-sm">
              新密码
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="mt-1"
              autoComplete="new-password"
            />
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-sm">
              确认新密码
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="mt-1"
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={pwdSaving}>
              <Save className="h-4 w-4" aria-hidden="true" />
              {pwdSaving ? '保存中...' : '保存修改'}
            </Button>
            {pwdMsg && (
              <p
                className={`text-sm ${
                  pwdMsg.startsWith('修改失败') ||
                  pwdMsg.startsWith('请') ||
                  pwdMsg.startsWith('两次') ||
                  pwdMsg.startsWith('新密码')
                    ? 'text-destructive'
                    : 'text-success'
                }`}
                role="status"
              >
                {pwdMsg}
              </p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
};

export default ProfilePage;
