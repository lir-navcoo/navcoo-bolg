import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { mediaApi, adminApi } from '@/lib/api'
import { toast } from 'sonner'
import {
  Search,
  Upload,
  Loader2,
  Image,
  ZoomIn,
  Copy,
  Trash2,
  Check,
  Grid,
  List,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface MediaSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (url: string) => void
  multiple?: boolean
  selectedUrls?: string[]
  articleId?: string
  baseUrl?: string
}

// 获取带基础URL的完整图片地址
function getFullUrl(url: string, baseUrl?: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = baseUrl || 'http://localhost:8080'
  return `${base}${url}`
}

// 格式化文件大小
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaSelector({
  open,
  onOpenChange,
  onSelect,
  multiple = false,
  selectedUrls = [],
  articleId,
  baseUrl = 'http://localhost:8080',
}: MediaSelectorProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [previewZoom, setPreviewZoom] = useState(1)
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(selectedUrls))
  const [currentFolder, setCurrentFolder] = useState<string>('all')
  const [folderList, setFolderList] = useState<{ id: string; name: string; count: number }[]>([])
  const [articleMap, setArticleMap] = useState<Map<string, string>>(new Map())
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // 加载所有文章信息用于显示文件夹名称
  const loadArticleMap = useCallback(async () => {
    try {
      const res = await adminApi.getMyArticles(0, 100)
      if (res.success && res.data) {
        const map = new Map<string, string>()
        res.data.records.forEach((article: any) => {
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

  useEffect(() => {
    if (open) {
      loadArticleMap()
      loadFolderList()
    }
  }, [open, loadArticleMap, loadFolderList])

  // 当文件夹或搜索变化时加载媒体
  useEffect(() => {
    if (open) {
      loadMedia()
    }
  }, [open, currentFolder, searchQuery, loadMedia])

  // 重置选中状态
  useEffect(() => {
    if (open) {
      setLocalSelected(new Set(selectedUrls))
      setPreviewItem(null)
      setPreviewZoom(1)
    }
  }, [open, selectedUrls])

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentFolder === 'all' || currentFolder === 'public') {
        loadMedia()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, loadMedia])

  // 过滤媒体
  const filteredMedia = media.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 处理文件上传
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

  // 切换选择
  const toggleSelect = (item: MediaItem) => {
    if (multiple) {
      const newSelected = new Set(localSelected)
      if (newSelected.has(item.url)) {
        newSelected.delete(item.url)
      } else {
        newSelected.add(item.url)
      }
      setLocalSelected(newSelected)
    } else {
      // 单选时传递相对路径（用于封面等场景）
      onSelect(item.url)
      onOpenChange(false)
    }
  }

  // 确认选择
  const confirmSelection = () => {
    const selected = Array.from(localSelected)
    if (selected.length > 0) {
      // 多选时传递完整 URL 数组的 JSON，单选时传递相对路径
      if (multiple) {
        const fullUrls = selected.map(url => getFullUrl(url, baseUrl))
        onSelect(JSON.stringify(fullUrls))
      } else {
        onSelect(selected[0])
      }
      onOpenChange(false)
    }
  }

  // 删除媒体
  const handleDelete = async (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const res = await mediaApi.delete(item.id)
      if (res.success) {
        setMedia(prev => prev.filter(m => m.id !== item.id))
        toast.success('删除成功')
      }
    } catch (error) {
      toast.error('删除失败')
    }
  }

  // 复制链接
  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('链接已复制')
    } catch {
      toast.error('复制失败')
    }
  }

  // 预览操作
  const zoomIn = () => setPreviewZoom(z => Math.min(z + 0.25, 3))
  const zoomOut = () => setPreviewZoom(z => Math.max(z - 0.25, 0.25))
  const resetZoom = () => setPreviewZoom(1)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              选择图片
            </DialogTitle>
          </DialogHeader>

          {/* 工具栏 */}
          <div className="flex items-center gap-4 py-4 border-b flex-shrink-0">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索图片..."
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
              disabled={uploading}
              size="sm"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              上传
            </Button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* 左侧文件夹列表 */}
            <div className="w-48 border-r pr-4 overflow-y-auto flex-shrink-0">
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
                      <Image className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="truncate flex-1">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">{folder.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧图片列表 */}
            <div className="flex-1 overflow-auto pl-4">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Image className="h-12 w-12 mb-4 opacity-50" />
                  <p>暂无图片</p>
                  <p className="text-sm">点击上方&quot;上传&quot;按钮添加图片</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredMedia.map((item) => (
                    <Card
                      key={item.id}
                      className={cn(
                        'group cursor-pointer overflow-hidden transition-all',
                        localSelected.has(item.url) && 'ring-2 ring-primary'
                      )}
                      onClick={() => toggleSelect(item)}
                    >
                      <CardContent className="p-0 aspect-square relative">
                        <img
                          src={getFullUrl(item.url, baseUrl)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f0f0f0" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23999" font-size="12">加载失败</text></svg>'
                          }}
                        />
                        {localSelected.has(item.url) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              setPreviewItem(item)
                            }}
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              copyUrl(getFullUrl(item.url, baseUrl))
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={(e) => handleDelete(item, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors',
                        localSelected.has(item.url) && 'bg-primary/10',
                        'hover:bg-muted'
                      )}
                      onClick={() => toggleSelect(item)}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={getFullUrl(item.url, baseUrl)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatSize(item.size)}</span>
                          {item.width && item.height && (
                            <span>{item.width}×{item.height}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {localSelected.has(item.url) && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyUrl(getFullUrl(item.url, baseUrl))
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={(e) => handleDelete(item, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 底部操作栏 */}
          {multiple && (
            <div className="flex items-center justify-between pt-4 border-t flex-shrink-0">
              <p className="text-sm text-muted-foreground">
                已选择 {localSelected.size} 个文件
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  取消
                </Button>
                <Button onClick={confirmSelection} disabled={localSelected.size === 0}>
                  确认选择
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 预览对话框 */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate">{previewItem?.name}</span>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={zoomOut}>
                  <span className="text-lg">−</span>
                </Button>
                <span className="text-sm w-12 text-center">{Math.round(previewZoom * 100)}%</span>
                <Button size="icon" variant="ghost" onClick={zoomIn}>
                  <span className="text-lg">+</span>
                </Button>
                <Button size="icon" variant="ghost" onClick={resetZoom}>
                  <span className="text-xs">重置</span>
                </Button>
                <Button size="icon" variant="ghost" onClick={() => previewItem && copyUrl(getFullUrl(previewItem.url, baseUrl))}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center overflow-auto max-h-[70vh] bg-muted rounded-lg">
            {previewItem && (
              <img
                src={getFullUrl(previewItem.url, baseUrl)}
                alt={previewItem.name}
                style={{ transform: `scale(${previewZoom})`, transition: 'transform 0.2s' }}
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
