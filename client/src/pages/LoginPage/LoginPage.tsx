import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login as authLogin, setToken } from '@client/src/api/auth';
import type { LoginRequest } from '@shared/api.interface';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    account: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.account.trim()) {
      setError('请输入账号');
      return;
    }
    if (!formData.password) {
      setError('请输入密码');
      return;
    }

    setLoading(true);
    try {
      const result = await authLogin(formData);
      setToken(result.token);
      logger.info('Login successful');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '登录失败，请重试';
      logger.error(`Login failed: ${message}`);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 登录卡片 */}
      <article className="bg-white rounded-xl p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-foreground mb-2">欢迎回来</h1>
          <p className="text-base text-muted-foreground">登录您的视在必行账号</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5">
            {/* 账号输入 */}
            <div className="space-y-2">
              <label htmlFor="account" className="block text-sm font-medium text-foreground">
                账号
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

            {/* 密码输入 */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                密码
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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
                请输入密码
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

            {/* 登录按钮 */}
            <Button
              type="submit"
              className="w-full h-12 rounded-lg text-base font-medium"
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </div>
        </form>

        {/* 辅助行 */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          还没有账号？{' '}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            立即注册
          </Link>
        </div>

        {/* 分隔线 */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-border" aria-hidden="true" />
          <span className="text-xs text-muted-foreground">或使用以下方式登录</span>
          <div className="flex-1 h-px bg-border" aria-hidden="true" />
        </div>

        {/* 第三方登录 */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="微信登录"
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.406-.032zm-2.038 2.36c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
            </svg>
          </button>
          <button
            type="button"
            className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="微博登录"
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
              <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.57-.18-.405-.649.353-1.017.389-1.891.004-2.521-.72-1.176-2.67-1.112-4.89-.033 0 0-.703.308-.525-.253.342-1.099.288-2.026-.227-2.58-1.194-1.288-4.269.045-6.87 2.978C3.68 10.835 2.6 13.241 2.6 15.271c0 3.953 4.997 6.393 9.852 6.393 6.391 0 10.608-3.793 10.608-6.793 0-1.809-1.522-2.835-2.991-3.223zm1.293-5.464c-.768-.885-1.9-1.267-3.001-1.132-.276.034-.476.287-.442.563.034.276.287.476.563.442.744-.089 1.493.158 2.004.747.528.607.715 1.406.512 2.151-.075.272.082.556.354.631.272.075.556-.082.631-.354.292-1.068.037-2.212-.621-3.048zm-1.648 1.831c-.361-.416-.893-.596-1.406-.53-.203.026-.377.187-.403.39-.026.203.1.389.303.415.172.022.351.087.495.253.164.189.222.439.166.671-.041.169.061.341.23.382.169.041.341-.061.382-.23.084-.346-.002-.71-.267-1.021z" />
            </svg>
          </button>
          <button
            type="button"
            className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="QQ登录"
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
              <path d="M21.395 15.035a39.548 39.548 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.396.014-.396 0-4.636-3.023-8.398-7.527-8.398S4.473 5.044 4.473 9.68c0 .239.02.612.02.612l-1.113 2.783a40.543 40.543 0 0 0-.747 2.132c-.123.411-.232.783-.29 1.07-.172.864.083 1.181.395 1.181.272 0 .594-.278.791-.465.059.231.126.46.2.686.232.703.501 1.371.811 2.008.118.247.243.49.379.731-.54 1.308-1.155 2.952-1.155 2.952-.063.175.066.342.245.356 1.283.1 3.047.574 4.696.574 1.653 0 3.42-.474 4.701-.574.178-.014.306-.181.243-.356 0 0-.616-1.644-1.155-2.952.136-.241.261-.484.379-.731.31-.637.579-1.305.811-2.008.074-.226.141-.455.2-.686.197.187.519.465.791.465.312 0 .567-.317.395-1.181-.058-.287-.167-.659-.29-1.07z" />
            </svg>
          </button>
        </div>
      </article>

      {/* 隐私说明卡片 */}
      <article className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-1">
              我们非常重视您的隐私
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              您的数据将使用行业标准的加密技术（AES-256）进行保护，确保您的信息安全。
              详细信息请查看我们的
              <Link
                to="/help"
                className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
              >
                隐私政策
              </Link>
              和
              <Link
                to="/help"
                className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded ml-1"
              >
                服务条款
              </Link>
              。
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default LoginPage;
