import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { adminApi, articleApi } from '@/lib/api'
import type { Article, Statistics } from '@/types'
import {
  FileText,
  FileCheck,
  FileClock,
  Eye,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  BarChart3,
  MessageSquare,
  Clock,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

export function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Statistics | null>(null)
  const [recentArticles, setRecentArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsRes, articlesRes] = await Promise.all([
        adminApi.getStatistics(),
        adminApi.getMyArticles(0, 6)
      ])

      if (statsRes.success) {
        setStats(statsRes.data)
      }
      if (articlesRes.success) {
        setRecentArticles(articlesRes.data.records)
      }
    } catch (error) {
      console.error('加载数据失败:', error)
      toast.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    
    try {
      setDeletingId(id)
      const res = await adminApi.delete(id)
      if (res.success) {
        toast.success('删除成功')
        loadData()
      }
    } catch (error) {
      toast.error('删除失败')
    } finally {
      setDeletingId(null)
    }
  }

  const statCards = [
    {
      title: '文章总数',
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: '已发布',
      value: stats?.publishedArticles || 0,
      icon: FileCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: '草稿箱',
      value: stats?.draftArticles || 0,
      icon: FileClock,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-500/20 to-amber-600/10',
      borderColor: 'border-amber-500/20'
    },
    {
      title: '总浏览量',
      value: recentArticles?.reduce((sum, a) => sum + a.viewCount, 0) || 0,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10',
      borderColor: 'border-purple-500/20'
    }
  ]

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
              <p className="text-muted-foreground">欢迎回来，开始创作吧</p>
            </div>
          </div>
        </div>
        <Link to="/admin/editor">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            写文章
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardContent className="p-6">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-8 w-20 mt-4" />
                <Skeleton className="h-4 w-24 mt-2" />
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((stat, index) => (
            <Card 
              key={stat.title} 
              className={`relative overflow-hidden border ${stat.borderColor} hover:shadow-lg transition-all duration-300`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <TrendingUp className="h-4 w-4 text-muted-foreground/50" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles - 2/3 width */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                最近文章
              </CardTitle>
              <CardDescription>您最近编辑的文章</CardDescription>
            </div>
            <Link to="/admin/articles">
              <Button variant="ghost" size="sm" className="gap-1">
                查看全部
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentArticles.length > 0 ? (
              <div className="space-y-2">
                {recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/admin/editor/${article.id}`)}
                  >
                    {article.coverImage ? (
                      <img
                        src={article.coverImage}
                        alt=""
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary/50" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(article.updatedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.viewCount}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={article.published ? "default" : "secondary"}
                        className={article.published ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : ""}
                      >
                        {article.published ? '已发布' : '草稿'}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/admin/editor/${article.id}`)
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            window.open(`/article/${article.id}`, '_blank')
                          }}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            预览
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(article.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-primary/50" />
                </div>
                <p className="text-muted-foreground mb-4">还没有文章</p>
                <Link to="/admin/editor">
                  <Button>开始写作</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - 1/3 width */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              快捷操作
            </CardTitle>
            <CardDescription>常用功能入口</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/editor" className="block">
              <Button variant="outline" className="w-full justify-start h-12">
                <div className="p-2 rounded-lg bg-primary/10 mr-3">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">写新文章</p>
                  <p className="text-xs text-muted-foreground">开始创作</p>
                </div>
              </Button>
            </Link>
            <Link to="/admin/articles" className="block">
              <Button variant="outline" className="w-full justify-start h-12">
                <div className="p-2 rounded-lg bg-blue-500/10 mr-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">文章管理</p>
                  <p className="text-xs text-muted-foreground">查看全部文章</p>
                </div>
              </Button>
            </Link>
            <Link to="/admin/categories" className="block">
              <Button variant="outline" className="w-full justify-start h-12">
                <div className="p-2 rounded-lg bg-amber-500/10 mr-3">
                  <BarChart3 className="h-4 w-4 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">分类管理</p>
                  <p className="text-xs text-muted-foreground">管理文章分类</p>
                </div>
              </Button>
            </Link>
            <Link to="/admin/settings" className="block">
              <Button variant="outline" className="w-full justify-start h-12">
                <div className="p-2 rounded-lg bg-purple-500/10 mr-3">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">系统设置</p>
                  <p className="text-xs text-muted-foreground">博客配置</p>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">最后更新</p>
            <p className="font-medium">{recentArticles[0] ? formatDate(recentArticles[0].updatedAt) : '暂无'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border">
          <Eye className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">平均阅读</p>
            <p className="font-medium">
              {recentArticles.length > 0 
                ? Math.round(recentArticles.reduce((sum, a) => sum + a.viewCount, 0) / recentArticles.length)
                : 0}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">文章评论</p>
            <p className="font-medium">功能开发中</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">博客成长</p>
            <p className="font-medium">持续更新</p>
          </div>
        </div>
      </div>
    </div>
  )
}
