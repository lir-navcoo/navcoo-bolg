import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { HomePage } from '@/pages/HomePage'
import { ArticlePage } from '@/pages/ArticlePage'
import { ArticlesPage } from '@/pages/ArticlesPage'
import { SearchPage } from '@/pages/SearchPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { ArticlesPage as AdminArticlesPage } from '@/pages/admin/ArticlesPage'
import { EditorPage } from '@/pages/admin/EditorPage'
import { TagsPage } from '@/pages/admin/TagsPage'
import { CategoriesPage } from '@/pages/admin/CategoriesPage'
import { MediaPage } from '@/pages/admin/MediaPage'
import { SettingsPage } from '@/pages/admin/SettingsPage'
import MenuPage from '@/pages/admin/MenuPage'
import { TooltipProvider } from '@/components/ui/tooltip'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}

// Public Layout
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <TooltipProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/articles"
          element={
            <PublicLayout>
              <ArticlesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/article/:id"
          element={
            <PublicLayout>
              <ArticlePage />
            </PublicLayout>
          }
        />
        <Route
          path="/category/:category"
          element={
            <PublicLayout>
              <ArticlesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/search"
          element={
            <PublicLayout>
              <SearchPage />
            </PublicLayout>
          }
        />
        <Route
          path="/favorites"
          element={
            <PublicLayout>
              <FavoritesPage />
            </PublicLayout>
          }
        />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="editor/:id" element={<EditorPage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </TooltipProvider>
  )
}

export default App
