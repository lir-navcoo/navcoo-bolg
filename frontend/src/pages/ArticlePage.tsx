import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { articleApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import type { Article } from '@/types'
import { ArrowLeft, Calendar, Eye, Tag, ArrowRight, Bookmark, Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

export function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (id) {
      loadArticle()
    }
  }, [id])

  const loadArticle = async () => {
    try {
      setLoading(true)
      const response = await articleApi.getDetail(id)
      if (response.success) {
        setArticle(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('加载文章失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('链接已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('复制失败，请手动复制')
    }
  }

  // 检测浏览器是否支持自动添加书签
  const canAutoBookmark = (): boolean => {
    // Firefox 支持 window.sidebar.addPanel
    if (window.sidebar && window.sidebar.addPanel) {
      return true
    }
    // IE 支持 window.external.addFavorite
    if (window.external && window.external.addFavorite) {
      return true
    }
    return false
  }

  const handleAddBookmark = () => {
    const url = window.location.href
    const title = article?.title || document.title
    
    // 检测操作系统
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const shortcut = isMac ? '⌘+D' : 'Ctrl+D'
    
    // 如果浏览器支持自动添加书签
    if (canAutoBookmark()) {
      if (window.sidebar && window.sidebar.addPanel) {
        // Firefox
        window.sidebar.addPanel(title, url, '')
        toast.success('已添加到收藏夹')
      } else if (window.external && window.external.addFavorite) {
        // IE
        window.external.addFavorite(url, title)
        toast.success('已添加到收藏夹')
      }
      return
    }
    
    // 不支持的浏览器（Chrome/Safari/Edge 等），直接提示手动添加
    toast.info(`请按 ${shortcut} 将 "${title}" 添加到书签`, {
      description: `也可以从浏览器菜单中选择"收藏"或"书签"→"添加书签"`,
      duration: 5000,
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-80 w-full mb-8 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">文章不存在</h1>
        <p className="text-muted-foreground mb-6">{error || '该文章可能已被删除或不存在'}</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回首页
        </Button>
      </div>
    )
  }

  return (
    <article className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>

          {/* Category */}
          {article.category && (
            <Badge variant="secondary" className="mb-4">
              {article.category}
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {article.author && (
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={article.author.avatar} />
                  <AvatarFallback>{article.author.nickname?.[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">
                  {article.author.nickname || article.author.username}
                </span>
              </div>
            )}
            <Separator orientation="vertical" className="h-6" />
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
            <Separator orientation="vertical" className="h-6" />
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {article.viewCount} 阅读
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-3">
            {/* Cover Image */}
            {article.coverImage && (
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full rounded-xl mb-8 max-h-96 object-cover"
              />
            )}

            {/* Summary */}
            {article.summary && (
              <Card className="mb-8 bg-muted/50 border-none">
                <CardContent className="p-6">
                  <p className="text-lg text-muted-foreground italic">
                    {article.summary}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {article.tags && (
              <div className="flex items-center gap-2 mb-8">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {article.tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}

            {/* Main Content */}
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Share & Actions */}
            <Card className="mt-12">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium mb-1">觉得这篇文章有帮助？</p>
                    <p className="text-sm text-muted-foreground">分享给需要的朋友吧</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={copied ? "default" : "outline"} 
                      size="sm"
                      onClick={handleCopyLink}
                      disabled={copied}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          复制链接
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddBookmark}
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      添加书签
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Author Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-4">
                      <AvatarImage src={article.author?.avatar} />
                      <AvatarFallback className="text-xl">
                        {article.author?.nickname?.[0] || article.author?.username?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold mb-1">
                      {article.author?.nickname || article.author?.username}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {article.author?.bio || '作者暂无简介'}
                    </p>
                    {isAuthenticated ? (
                      <Link to="/admin">
                        <Button size="sm" variant="outline" className="w-full">
                          进入后台
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/login">
                        <Button size="sm" variant="outline" className="w-full">
                          登录
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Related Actions */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  <Link to="/" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      返回首页
                    </Button>
                  </Link>
                  <Link to="/articles" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      更多文章
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
