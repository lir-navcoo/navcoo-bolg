'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  Image,
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  X,
  Grid,
  List,
  FolderOpen,
  Loader2,
  ExternalLink,
  CloudUpload,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Move,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import { mediaApi, adminApi } from '@/lib/api'

interface MediaItem {
  id: number
  name: string
  url: string
  type: string
  size: number
  width?: number
  height?: number
  articleId?: string
  uploaderId?: number
  createdAt: string
  updatedAt: string
}

interface ArticleInfo {
  id: string
  title: string
}

interface FolderItem {
  id: string
  name: string
  count: number
}

const API_BASE = 'http://localhost:8080'

// 获取完整 URL
function getFullUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_BASE}${url}`
}

// 格式化文件大小
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 分组相关状态
  const [currentFolder, setCurrentFolder] = useState<string>('all')
  const [folderList, setFolderList] = useState<FolderItem[]>([])
  const [articleMap, setArticleMap] = useState<Map<string, string>>(new Map())

  // 预览状态
  const [previewZoom, setPreviewZoom] = useState(1)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // 加载所有文章信息用于显示文件夹名称
  const loadArticleMap = useCallback(async () => {
    try {
      const res = await adminApi.getMyArticles(0, 100)
      if (res.success && res.data) {
        const map = new Map<string, string>()
        res.data.records.forEach((article: ArticleInfo) => {
          map.set(article.id, article.title)
        })
        setArticleMap(map)
      }
    } catch (error) {
      console.error('加载文章列表失败:', error)
    }
  }, [])

  // 加载媒体列表
  const loadMedia = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page: 1, size: 100 }

      if (currentFolder === 'public') {
        // 公共媒体
        const res = await mediaApi.getPublic()
        if (res.success && res.data) {
          setMedia(res.data)
        }
      } else if (currentFolder === 'all') {
        // 所有媒体（包含搜索）
        if (searchQuery) {
          params.keyword = searchQuery
        }
        const res = await mediaApi.getList(params)
        if (res.success && res.data) {
          setMedia(Array.isArray(res.data) ? res.data : (res.data.records || []))
        }
      } else {
        // 特定文章ID的媒体
        const res = await mediaApi.getByArticle(currentFolder)
        if (res.success && res.data) {
          setMedia(res.data)
        }
      }
    } catch (error) {
      console.error('加载媒体失败:', error)
      toast.error('加载媒体失败')
    } finally {
      setLoading(false)
    }
  }, [currentFolder, searchQuery])

  // 加载文件夹列表（按文章分类）
  const loadFolderList = useCallback(async () => {
    try {
      // 获取所有媒体，然后按文章分组
      const res = await mediaApi.getList({ page: 1, size: 1000 })
      if (res.success && res.data) {
        const mediaList = Array.isArray(res.data) ? res.data : (res.data.records || [])
        const folderMap = new Map<string, number>()
        mediaList.forEach((item: MediaItem) => {
          if (item.articleId) {
            const count = folderMap.get(item.articleId) || 0
            folderMap.set(item.articleId, count + 1)
          }
        })

        // 获取文章标题用于显示
        const folders = Array.from(folderMap.entries()).map(([id, count]) => {
          const title = articleMap.get(id) || id.substring(0, 8)
          const displayName = title.length > 12 ? title.substring(0, 12) + '...' : title
          return {
            id,
            name: displayName,
            count,
          }
        })

        // 添加公共文件夹
        const publicCount = mediaList.filter((item: MediaItem) => !item.articleId).length
        const total = Array.isArray(res.data) ? res.data.length : (res.data.total || 0)
        setFolderList([
          { id: 'all', name: '全部媒体', count: total },
          { id: 'public', name: '公共资源', count: publicCount },
          ...folders,
        ])
      }
    } catch (error) {
      console.error('加载文件夹列表失败:', error)
    }
  }, [articleMap])

  // 初始加载
  useEffect(() => {
    loadArticleMap()
  }, [loadArticleMap])

  // 加载文件夹列表
  useEffect(() => {
    loadFolderList()
  }, [loadFolderList])

  // 当文件夹或搜索变化时加载媒体
  useEffect(() => {
    loadMedia()
  }, [currentFolder, searchQuery, loadMedia])

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentFolder === 'all' || currentFolder === 'public') {
        loadMedia()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, loadMedia])

  const filteredMedia = media.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 缩放操作
  const zoomIn = useCallback(() => {
    setPreviewZoom(z => Math.min(z + 0.25, 5))
  }, [])

  const zoomOut = useCallback(() => {
    setPreviewZoom(z => Math.max(z - 0.25, 0.1))
  }, [])

  const resetZoom = useCallback(() => {
    setPreviewZoom(1)
    setPreviewPosition({ x: 0, y: 0 })
  }, [])

  // 拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    if (previewZoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - previewPosition.x, y: e.clientY - previewPosition.y })
    }
  }

  // 拖拽中
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPreviewPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }, [isDragging, dragStart])

  // 拖拽结束
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      setPreviewZoom(z => Math.min(z + 0.1, 5))
    } else {
      setPreviewZoom(z => Math.max(z - 0.1, 0.1))
    }
  }, [])

  // 键盘快捷键
  useEffect(() => {
    if (!isPreviewOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false)
          } else {
            setIsPreviewOpen(false)
          }
          break
        case '+':
        case '=':
          zoomIn()
          break
        case '-':
          zoomOut()
          break
        case '0':
          resetZoom()
          break
        case 'ArrowLeft':
          navigatePreview('prev')
          break
        case 'ArrowRight':
          navigatePreview('next')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPreviewOpen, isFullscreen, zoomIn, zoomOut, resetZoom])

  // 切换全屏
  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      toast.error('全屏模式不支持')
    }
  }

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false)
      }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // 导航到上一张/下一张
  const currentIndex = selectedItem ? filteredMedia.findIndex(m => m.id === selectedItem.id) : -1

  const navigatePreview = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return
    let newIndex
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredMedia.length - 1
    } else {
      newIndex = currentIndex < filteredMedia.length - 1 ? currentIndex + 1 : 0
    }
    setSelectedItem(filteredMedia[newIndex])
    setPreviewZoom(1)
    setPreviewPosition({ x: 0, y: 0 })
    setImageLoaded(false)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setUploading(true)

      // 确定上传到哪个文件夹：全部/公共 -> common(articleId=undefined)，其他 -> currentFolder
      const uploadArticleId = currentFolder === 'all' || currentFolder === 'public'
        ? undefined
        : currentFolder

      if (files.length === 1) {
        const res = await mediaApi.upload(files[0], uploadArticleId)
        if (res.success && res.data) {
          setMedia(prev => [res.data, ...prev])
          toast.success('上传成功')
        }
      } else {
        const res = await mediaApi.uploadBatch(Array.from(files), uploadArticleId)
        if (res.success && res.data) {
          setMedia(prev => [...res.data.data, ...prev])
          if (res.data.errors && res.data.errors.length > 0) {
            toast.warning(`${res.data.data.length} 个上传成功，${res.data.errors.length} 个失败`)
          } else {
            toast.success(`成功上传 ${res.data.data.length} 个文件`)
          }
        }
      }
    } catch (error) {
      toast.error('上传失败')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleCopyUrl = async (item: MediaItem) => {
    try {
      const fullUrl = getFullUrl(item.url)
      await navigator.clipboard.writeText(fullUrl)
      setCopiedId(item.id)
      toast.success('链接已复制')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return

    try {
      setLoading(true)
      const res = await mediaApi.delete(selectedItem.id)
      if (res.success) {
        setMedia(media.filter(m => m.id !== selectedItem.id))
        toast.success('删除成功')
        setIsDeleteOpen(false)
        setSelectedItem(null)
      }
    } catch (error) {
      toast.error('删除失败')
    } finally {
      setLoading(false)
    }
  }

  const openPreview = (item: MediaItem) => {
    setSelectedItem(item)
    setIsPreviewOpen(true)
    setPreviewZoom(1)
    setPreviewPosition({ x: 0, y: 0 })
    setImageLoaded(false)
  }

  // 关闭预览时重置状态
  const closePreview = () => {
    setIsPreviewOpen(false)
    if (isFullscreen) {
      document.exitFullscreen().catch(() => {})
    }
  }

  // 获取当前文件夹名称
  const getCurrentFolderName = () => {
    if (currentFolder === 'all') return '全部媒体'
    if (currentFolder === 'public') return '公共资源'
    const articleTitle = articleMap.get(currentFolder)
    return articleTitle || currentFolder.substring(0, 8)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10">
            <Image className="h-6 w-6 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">媒体库</h1>
            <p className="text-muted-foreground">管理文章图片和媒体文件</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                上传文件
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content - Sidebar + Grid */}
      <div className="flex gap-6">
        {/* Left Sidebar - Folder List */}
        <div className="w-56 flex-shrink-0">
          <div className="sticky top-6">
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">文件夹</span>
            </div>
            <div className="space-y-1">
              {folderList.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setCurrentFolder(folder.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    currentFolder === folder.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted'
                  )}
                  title={folder.id === 'all' || folder.id === 'public' ? folder.name : (articleMap.get(folder.id) || folder.id)}
                >
                  {folder.id === 'all' ? (
                    <Grid className="h-4 w-4 flex-shrink-0" />
                  ) : folder.id === 'public' ? (
                    <Image className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <FolderOpen className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="truncate flex-1">{folder.name}</span>
                  <span className="text-xs text-muted-foreground">{folder.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                当前: <span className="font-medium text-foreground">{getCurrentFolderName()}</span>
              </span>
              <span className="text-sm text-muted-foreground">
                ({filteredMedia.length} 个文件)
              </span>
            </div>
            <div className="flex-1" />
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索文件..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Upload Area */}
          <Card
            className="border-dashed cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="py-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  <CloudUpload className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">点击或拖拽文件到此处上传</p>
                <p className="text-sm text-muted-foreground mt-1">
                  支持 JPG、PNG、GIF、WebP 格式，最大 10MB
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  上传到: {getCurrentFolderName()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Media Grid/List */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0 aspect-square">
                    <Skeleton className="h-full w-full rounded-none" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMedia.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredMedia.map((item) => (
                  <Card
                    key={item.id}
                    className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => openPreview(item)}
                  >
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      <img
                        src={getFullUrl(item.url)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f0f0f0" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23999" font-size="12">加载失败</text></svg>'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyUrl(item)
                          }}
                        >
                          {copiedId === item.id ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            openPreview(item)
                          }}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedItem(item)
                            setIsDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{formatSize(item.size)}</span>
                        {item.width && item.height && (
                          <Badge variant="secondary" className="text-xs">
                            {item.width}×{item.height}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-sm">
                <div className="divide-y">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => openPreview(item)}
                    >
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={getFullUrl(item.url)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f0f0f0" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23999" font-size="12">加载失败</text></svg>'
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{formatSize(item.size)}</span>
                          {item.width && item.height && (
                            <>
                              <span>•</span>
                              <span>{item.width}×{item.height}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyUrl(item)
                          }}
                        >
                          {copiedId === item.id ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(getFullUrl(item.url), '_blank')
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedItem(item)
                            setIsDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Image className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">暂无媒体文件</p>
              <p className="text-sm mt-1">点击上方"上传文件"按钮添加图片</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden bg-black/95 border-none">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-white">{selectedItem?.name}</DialogTitle>
                <DialogDescription className="text-white/70">
                  {selectedItem && (
                    <>
                      {formatSize(selectedItem.size)}
                      {selectedItem.width && selectedItem.height && (
                        <> • {selectedItem.width}×{selectedItem.height}</>
                      )}
                      <> • {formatDate(selectedItem.createdAt)}</>
                    </>
                  )}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={closePreview}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Preview Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/60 rounded-full px-4 py-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-white text-sm min-w-[60px] text-center">
              {Math.round(previewZoom * 100)}%
            </span>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-white/30 mx-2" />
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={resetZoom}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleFullscreen}>
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation Arrows */}
          {filteredMedia.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12"
                onClick={() => navigatePreview('prev')}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12"
                onClick={() => navigatePreview('next')}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Image Container */}
          <div
            className="w-full h-[80vh] flex items-center justify-center overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
            {selectedItem && (
              <img
                src={getFullUrl(selectedItem.url)}
                alt={selectedItem.name}
                className="max-w-full max-h-full object-contain transition-transform duration-100"
                style={{
                  transform: `scale(${previewZoom}) translate(${previewPosition.x / previewZoom}px, ${previewPosition.y / previewZoom}px)`,
                }}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23333" width="200" height="200"/><text x="100" y="105" text-anchor="middle" fill="%23999" font-size="14">加载失败</text></svg>'
                  setImageLoaded(true)
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除 "{selectedItem?.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}