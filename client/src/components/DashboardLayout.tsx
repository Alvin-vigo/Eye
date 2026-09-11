import { useState, useEffect } from 'react';
import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
  Link,
} from 'react-router-dom';
import {
  Eye,
  LayoutDashboard,
  Smartphone,
  Sparkles,
  Accessibility,
  Cloud,
  HelpCircle,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { getToken, logout as authLogout } from '@client/src/api/auth';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, end, onClick }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground',
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      logger.warn('DashboardLayout: no token found, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authLogout();
      navigate('/login', { replace: true });
    } catch (err: unknown) {
      logger.error(`DashboardLayout logout error: ${err instanceof Error ? err.message : String(err)}`);
      // 无论如何跳转到登录页
      navigate('/login', { replace: true });
    }
  };

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: '总览', end: true },
    { to: '/dashboard/devices', icon: <Smartphone className="w-5 h-5" />, label: '我的设备' },
    { to: '/dashboard/features', icon: <Sparkles className="w-5 h-5" />, label: '核心功能' },
    { to: '/dashboard/accessibility', icon: <Accessibility className="w-5 h-5" />, label: '无障碍设置' },
    { to: '/dashboard/cloud', icon: <Cloud className="w-5 h-5" />, label: '云端服务' },
  ];

  const bottomNavItems = [
    { to: '/help', icon: <HelpCircle className="w-5 h-5" />, label: '帮助中心' },
    { to: '/dashboard/profile', icon: <User className="w-5 h-5" />, label: '个人资料' },
  ];

  const getBreadcrumb = (): string[] => {
    const pathMap: Record<string, string> = {
      '/dashboard': '总览',
      '/dashboard/devices': '我的设备',
      '/dashboard/features': '核心功能',
      '/dashboard/accessibility': '无障碍设置',
      '/dashboard/cloud': '云端服务',
      '/dashboard/profile': '个人资料',
    };
    return ['控制台', pathMap[location.pathname] || ''];
  };

  const breadcrumbs = getBreadcrumb();
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-sidebar-border flex flex-col',
          'transform transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="主导航"
      >
        {/* 品牌区 */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <span className="text-base font-bold text-foreground">视在必行</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={closeSidebar}
            className="lg:hidden ml-auto p-2 rounded-md hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="关闭侧边栏"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* 主导航 */}
        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="控制台导航">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              end={item.end}
              onClick={closeSidebar}
            />
          ))}
        </nav>

        {/* 底部导航 */}
        <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              onClick={closeSidebar}
            />
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
              'text-muted-foreground hover:bg-slate-100 hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
            aria-label="退出登录"
          >
            <LogOut className="w-5 h-5" />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部栏 */}
        <header className="h-16 border-b border-border bg-white flex items-center px-6 gap-4 sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="打开侧边栏"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>

          {/* 面包屑 */}
          <nav aria-label="面包屑导航" className="flex items-center text-sm">
            <ol className="flex items-center gap-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  )}
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground'
                    }
                  >
                    {crumb}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        {/* 主内容 */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
