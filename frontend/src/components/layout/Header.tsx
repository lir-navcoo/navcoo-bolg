import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/authStore'
import { useMenuStore } from '@/stores/menuStore'
import { useI18n, useLocale } from '@/i18n'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LocaleToggle } from '@/components/LocaleToggle'
import { SearchDialog } from '@/components/SearchDialog'
import { Search, Menu, X, PenSquare, LogOut, LayoutDashboard, User, Bookmark } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { t } = useI18n()
  const { isZh } = useLocale()
  const { getEnabledMenus } = useMenuStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const enabledMenus = getEnabledMenus()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="hidden sm:inline-block font-bold text-xl">{t('home')}</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {enabledMenus.map((menu) => (
                <Link
                  key={menu.id}
                  to={menu.url}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {isZh ? menu.name : menu.nameEn}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">{t('search')}</span>
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Language Toggle */}
              <LocaleToggle />

              {/* Write Button */}
              {isAuthenticated && (
                <Button
                  onClick={() => navigate('/admin/editor')}
                  size="icon"
                  className="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                >
                  <PenSquare className="h-4 w-4" />
                  <span className="sr-only">{t('writeArticle')}</span>
                </Button>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-1">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.avatar} alt={user?.nickname} />
                        <AvatarFallback>{user?.nickname?.[0] || user?.username?.[0]}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.nickname || user?.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">@{user?.username}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('adminDashboard')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/admin/editor')}>
                      <PenSquare className="mr-2 h-4 w-4" />
                      {t('writeArticle')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/favorites')}>
                      <Bookmark className="mr-2 h-4 w-4" />
                      我的收藏
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      {t('personalSettings')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => navigate('/login')} variant="default" size="sm">
                  {t('login')}
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t animate-fade-in">
              <nav className="flex flex-col space-y-2">
                {enabledMenus.map((menu) => (
                  <Link
                    key={menu.id}
                    to={menu.url}
                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {isZh ? menu.name : menu.nameEn}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}
