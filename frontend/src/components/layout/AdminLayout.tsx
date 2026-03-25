import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  Settings,
  LogOut,
  Tag,
  FolderTree,
  Image,
  ChevronLeft,
  Menu,
  ChevronRight,
  Sparkles,
  Globe,
  Moon,
  Sun,
  Link as LinkIcon
} from 'lucide-react'
import { useState } from 'react'

const mainNavItems = [
  { title: '仪表盘', href: '/admin', icon: LayoutDashboard },
  { title: '文章管理', href: '/admin/articles', icon: FileText },
  { title: '写文章', href: '/admin/editor', icon: PenSquare },
]

const contentNavItems = [
  { title: '分类管理', href: '/admin/categories', icon: FolderTree },
  { title: '标签管理', href: '/admin/tags', icon: Tag },
  { title: '媒体库', href: '/admin/media', icon: Image },
]

const systemNavItems = [
  { title: '菜单管理', href: '/admin/menu', icon: LinkIcon },
  { title: '系统设置', href: '/admin/settings', icon: Settings },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const NavGroup = ({ 
    title, 
    items, 
    collapsed 
  }: { 
    title?: string; 
    items: typeof mainNavItems; 
    collapsed: boolean 
  }) => (
    <div className="space-y-1">
      {!collapsed && title && (
        <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          {title}
        </p>
      )}
      {items.map((item) => {
        const isActive = location.pathname === item.href || 
          (item.href !== '/admin' && location.pathname.startsWith(item.href))
        return (
          <Link key={item.href} to={item.href}>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start transition-all',
                collapsed ? 'px-2' : '',
                isActive && 'bg-primary/10 text-primary hover:bg-primary/20'
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0', collapsed ? '' : 'mr-3')} />
              {!collapsed && <span>{item.title}</span>}
            </Button>
          </Link>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8"
            >
              {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-bold hidden sm:inline text-sm">博客管理</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="gap-2 text-muted-foreground"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">返回前台</span>
            </Button>
            <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
            <div className="flex items-center gap-2 pl-2">
              <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {user?.nickname?.[0] || user?.username?.[0] || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none">
                  {user?.nickname || user?.username}
                </p>
                <p className="text-xs text-muted-foreground">
                  管理员
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'sticky top-14 h-[calc(100vh-3.5rem)] border-r bg-background transition-all duration-300 flex flex-col',
            collapsed ? 'w-16' : 'w-64'
          )}
        >
          <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
            <NavGroup items={mainNavItems} collapsed={collapsed} />
            
            <Separator />
            
            <NavGroup title="内容管理" items={contentNavItems} collapsed={collapsed} />
            
            <Separator />
            
            <NavGroup title="系统" items={systemNavItems} collapsed={collapsed} />
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t">
            {!collapsed ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-destructive/70 hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>退出登录</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="w-full text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                title="退出登录"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-3.5rem)] overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
