import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { favoriteApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { Article } from '@/types'
import { ArrowLeft, Bookmark, Calendar, Eye, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export function FavoritesPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [favorites, setFavorites] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [removing, setRemoving] = useState<string | null>(null)

  const pageSize = 10

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('请先登录')
      navigate('/login')
      return
    }
    loadFavorites()
  }, [isAuthenticated, page])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const response = await favoriteApi.getMyFavorites(page, pageSize)
      if (response.success) {
        setFavorites(response.data.records)
        setTotal(response.data.total)
      }
    } catch (err) {
      toast.error('加载收藏失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (articleId: string) => {
    setRemoving(articleId)
    try {
      await favoriteApi.removeFavorite(articleId)
      setFavorites(prev => prev.filter(a => a.id !== articleId))
      setTotal(prev => prev - 1)
      toast.success('已取消收藏')
    } catch (err) {
      toast.error('取消收藏失败')
    } finally {
      setRemoving(null)
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
          
          <div className="flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">我的收藏</h1>
              <p className="text-muted-foreground">共收藏 {total} 篇文章</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && favorites.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h2 className="text-xl font-bold mb-2">暂无收藏</h2>
              <p className="text-muted-foreground mb-6">
                去发现更多精彩文章吧！
              </p>
              <Link to="/articles">
                <Button>浏览文章</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Favorites List */}
        {!loading && favorites.length > 0 && (
          <div className="space-y-4">
            {favorites.map(article => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Cover Image */}
                    {article.coverImage && (
                      <Link to={`/article/${article.id}`} className="flex-shrink-0">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                      </Link>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/article/${article.id}`}>
                        <h3 className="text-lg font-bold mb-2 hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                      </Link>
                      
                      {article.summary && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {article.summary}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {article.category && (
                          <Badge variant="secondary" className="text-xs">
                            {article.category}
                          </Badge>
                        )}
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(article.publishedAt || article.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {article.viewCount}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFavorite(article.id)}
                        disabled={removing === article.id}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              上一页
            </Button>
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              第 {page} / {totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              下一页
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
