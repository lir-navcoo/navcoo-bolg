import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { tagApi, type Tag, type TagRequest } from '@/lib/api'
import { toast } from 'sonner'
import { 
  Tag as TagIcon, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Hash,
  Loader2
} from 'lucide-react'

export function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [tagName, setTagName] = useState('')
  const [tagDescription, setTagDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      setLoading(true)
      const res = await tagApi.getAll()
      if (res.success && res.data) {
        setTags(res.data)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || '加载标签失败')
    } finally {
      setLoading(false)
    }
  }

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = async () => {
    if (!tagName.trim()) {
      toast.error('请输入标签名称')
      return
    }

    try {
      setSaving(true)
      const request: TagRequest = {
        name: tagName.trim(),
        description: tagDescription.trim() || undefined
      }
      await tagApi.create(request)
      toast.success('添加成功')
      setIsAddDialogOpen(false)
      setTagName('')
      setTagDescription('')
      loadTags()
    } catch (error: any) {
      toast.error(error.response?.data?.message || '添加失败')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedTag || !tagName.trim()) return

    try {
      setSaving(true)
      const request: TagRequest = {
        name: tagName.trim(),
        description: tagDescription.trim() || undefined
      }
      await tagApi.update(selectedTag.id, request)
      toast.success('修改成功')
      setIsEditDialogOpen(false)
      setTagName('')
      setTagDescription('')
      setSelectedTag(null)
      loadTags()
    } catch (error: any) {
      toast.error(error.response?.data?.message || '修改失败')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedTag) return

    try {
      setDeletingId(selectedTag.id)
      await tagApi.delete(selectedTag.id)
      toast.success('删除成功')
      setIsDeleteDialogOpen(false)
      setSelectedTag(null)
      loadTags()
    } catch (error: any) {
      toast.error(error.response?.data?.message || '删除失败')
    } finally {
      setDeletingId(null)
    }
  }

  const openEditDialog = (tag: Tag) => {
    setSelectedTag(tag)
    setTagName(tag.name)
    setTagDescription(tag.description || '')
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (tag: Tag) => {
    setSelectedTag(tag)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10">
            <Hash className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">标签管理</h1>
            <p className="text-muted-foreground">管理文章的标签，共 {tags.length} 个标签</p>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          添加标签
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索标签..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tags Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-12 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTags.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTags.map((tag) => (
            <Card 
              key={tag.id} 
              className="group hover:shadow-md transition-all duration-200 border-0 shadow-sm"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-medium">
                        {tag.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {tag.articleCount || 0} 篇文章
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(tag)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(tag)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-4">
                <TagIcon className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground">
                {searchQuery ? '没有找到匹配的标签' : '还没有标签'}
              </p>
              {!searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  添加第一个标签
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              添加标签
            </DialogTitle>
            <DialogDescription>
              创建一个新的标签用于分类文章
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">标签名称</label>
                <Input
                  placeholder="输入标签名称"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAdd()
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">描述（可选）</label>
                <Input
                  placeholder="标签描述"
                  value={tagDescription}
                  onChange={(e) => setTagDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAdd} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  添加中...
                </>
              ) : (
                '添加'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary" />
              编辑标签
            </DialogTitle>
            <DialogDescription>
              修改标签名称
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">标签名称</label>
                <Input
                  placeholder="输入标签名称"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">描述（可选）</label>
                <Input
                  placeholder="标签描述"
                  value={tagDescription}
                  onChange={(e) => setTagDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEdit} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                '保存'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              删除标签
            </AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除标签 "{selectedTag?.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingId !== null}
            >
              {deletingId !== null ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  删除中...
                </>
              ) : (
                '删除'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
