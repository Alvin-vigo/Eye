import { Outlet, Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 flex flex-col">
      <header className="w-full py-6 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <Eye className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight">
                视在必行 <span className="text-primary">VisionPilot</span>
              </h1>
              <p className="text-sm text-muted-foreground">智能助盲终端服务平台</p>
            </div>
          </Link>
          <nav aria-label="顶部导航">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
                >
                  帮助中心
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
                >
                  关于我们
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md" role="main">
          <Outlet />
        </div>
      </main>

      <footer className="w-full py-6 px-8 border-t border-border/40 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 视在必行 VisionPilot. 保留所有权利。</p>
          <nav aria-label="底部链接">
            <ul className="flex items-center gap-4">
              <li>
                <Link
                  to="/help"
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  帮助中心
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">|</li>
              <li>
                <Link
                  to="/help"
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  隐私政策
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">|</li>
              <li>
                <Link
                  to="/help"
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  服务条款
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">|</li>
              <li>
                <Link
                  to="/help"
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  关于我们
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
