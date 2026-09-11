import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { register as authRegister, setToken } from '@client/src/api/auth';
import type { RegisterRequest } from '@shared/api.interface';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    account: '',
    verifyCode: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = () => {
    if (!formData.account.trim()) {
      setError('请先输入手机号或邮箱');
      return;
    }
    setError(null);
    setCodeSent(true);
    setCountdown(60);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCodeSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.account.trim()) {
      setError('请输入手机号或邮箱');
      return;
    }
    if (!formData.verifyCode.trim()) {
      setError('请输入验证码');
      return;
    }
    if (formData.password.length < 6) {
      setError('密码长度至少6位');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      const result = await authRegister(formData);
      setToken(result.token);
      logger.info('Register successful');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '注册失败，请重试';
      logger.error(`Register failed: ${message}`);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-bold text-foreground mb-2">创建新账号</h1>
        <p className="text-base text-muted-foreground">
          加入视在必行，开启智能助盲新体验
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">
          {/* 账号输入 */}
          <div className="space-y-2">
            <label htmlFor="account" className="block text-sm font-medium text-foreground">
              手机号 / 邮箱
            </label>
            <Input
              id="account"
              type="text"
              autoComplete="username"
              placeholder="请输入手机号或邮箱"
              value={formData.account}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              disabled={loading}
              className="h-12"
              aria-describedby="account-hint"
            />
            <p id="account-hint" className="text-xs text-muted-foreground">
              请输入手机号或邮箱
            </p>
          </div>

          {/* 验证码 */}
          <div className="space-y-2">
            <label htmlFor="verifyCode" className="block text-sm font-medium text-foreground">
              验证码
            </label>
            <div className="flex gap-3">
              <Input
                id="verifyCode"
                type="text"
                placeholder="请输入验证码"
                value={formData.verifyCode}
                onChange={(e) => setFormData({ ...formData, verifyCode: e.target.value })}
                disabled={loading}
                className="h-12 flex-1"
                aria-describedby="code-hint"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSendCode}
                disabled={loading || codeSent}
                className="h-12 px-4 whitespace-nowrap"
              >
                {codeSent ? `${countdown}s 后重发` : '获取验证码'}
              </Button>
            </div>
            <p id="code-hint" className="text-xs text-muted-foreground">
              {codeSent ? '验证码已发送，请注意查收' : '点击按钮获取验证码'}
            </p>
          </div>

          {/* 密码输入 */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              设置密码
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                className="h-12 pr-12"
                aria-describedby="password-hint"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Eye className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
            <p id="password-hint" className="text-xs text-muted-foreground">
              密码长度至少6位
            </p>
          </div>

          {/* 确认密码 */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
              确认密码
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                disabled={loading}
                className="h-12 pr-12"
                aria-describedby="confirm-password-hint"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={showConfirmPassword ? '隐藏密码' : '显示密码'}
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Eye className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
            <p id="confirm-password-hint" className="text-xs text-muted-foreground">
              请再次输入密码
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div
              role="alert"
              className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2"
            >
              {error}
            </div>
          )}

          {/* 注册按钮 */}
          <Button
            type="submit"
            className="w-full h-12 rounded-lg text-base font-medium"
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </Button>
        </div>
      </form>

      {/* 辅助行 */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        已有账号？{' '}
        <Link
          to="/login"
          className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          立即登录
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
