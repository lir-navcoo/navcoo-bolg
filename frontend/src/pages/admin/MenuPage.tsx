'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { useMenuStore, type MenuItem } from '@/stores/menuStore'
import {
  Plus,
  Edit,
  Trash2,
  Link as LinkIcon,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Search
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function MenuPage() {
  const { menus, addMenu, updateMenu, deleteMenu, reorderMenu } = useMenuStore()
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    url: '',
    order: 0,
    enabled: true
  })

  const handleOpenAdd = () => {
    setEditingMenu(null)
    setFormData({
      name: '',
      nameEn: '',
      url: '',
      order: menus.length + 1,
      enabled: true
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (menu: MenuItem) => {
    setEditingMenu(menu)
    setFormData({
      name: menu.name,
      nameEn: menu.nameEn,
      url: menu.url,
      order: menu.order,
      enabled: menu.enabled
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.url) {
      toast.error('请填写菜单名称和链接地址')
      return
    }

    if (editingMenu) {
      updateMenu(editingMenu.id, formData)
      toast.success('菜单项已更新')
    } else {
      addMenu(formData)
      toast.success('菜单项已添加')
    }
    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    if (!deleteId) return
    setDeleting(true)
    deleteMenu(deleteId)
    toast.success('菜单项已删除')
    setDeleteId(null)
    setDeleting(false)
  }

  const handleToggleEnabled = (menu: MenuItem) => {
    updateMenu(menu.id, { enabled: !menu.enabled })
    toast.success(`菜单项已${!menu.enabled ? '启用' : '禁用'}`)
  }

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const sortedMenus = [...menus].sort((a, b) => a.order - b.order)
    const index = sortedMenus.findIndex(m => m.id === id)
    
    if (direction === 'up' && index > 0) {
      reorderMenu(id, sortedMenus[index - 1].order - 0.5)
    } else if (direction === 'down' && index < sortedMenus.length - 1) {
      reorderMenu(id, sortedMenus[index + 1].order + 0.5)
    }
  }

  const sortedMenus = [...menus]
    .sort((a, b) => a.order - b.order)
    .filter(menu => 
      !searchQuery || 
      menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.url.toLowerCase().includes(searchQuery.toLowerCase())
    )

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
            <LinkIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">菜单管理</h1>
            <p className="text-muted-foreground">自定义网站导航菜单</p>
          </div>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          添加菜单
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索菜单名称、链接..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Menu Table */}
      <Card>
        <CardHeader>
          <CardTitle>菜单列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedMenus.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">排序</TableHead>
                  <TableHead>菜单名称</TableHead>
                  <TableHead>链接地址</TableHead>
                  <TableHead className="w-[300px]">状态</TableHead>
                  <TableHead className="w-[100px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMenus.map((menu, index) => (
                  <TableRow key={menu.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMove(menu.id, 'up')}
                          disabled={index === 0}
                          className="h-7 w-7"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMove(menu.id, 'down')}
                          disabled={index === sortedMenus.length - 1}
                          className="h-7 w-7"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{menu.name}</span>
                          {!menu.enabled && (
                            <Badge variant="outline" className="text-xs">已禁用</Badge>
                          )}
                        </div>
                        {menu.nameEn && (
                          <p className="text-sm text-muted-foreground">
                            {menu.nameEn}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px]">
                        <p className="text-sm text-muted-foreground truncate">
                          {menu.url}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={menu.enabled}
                          onCheckedChange={() => handleToggleEnabled(menu)}
                          id={`enabled-${menu.id}`}
                        />
                        <Label
                          htmlFor={`enabled-${menu.id}`}
                          className="text-sm text-muted-foreground"
                        >
                          {menu.enabled ? '显示' : '隐藏'}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(menu)}>
                            <Edit className="h-4 w-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(menu.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">暂无菜单项</p>
              <Button onClick={handleOpenAdd}>
                <Plus className="h-4 w-4 mr-2" />
                添加菜单
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMenu ? '编辑菜单' : '添加菜单'}
            </DialogTitle>
            <DialogDescription>
              {editingMenu ? '修改菜单项信息' : '创建新的导航菜单项'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">菜单名称 *</Label>
              <Input
                id="name"
                placeholder="例如：关于我们"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nameEn">英文名称</Label>
              <Input
                id="nameEn"
                placeholder="例如：About Us"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">链接地址 *</Label>
              <Input
                id="url"
                placeholder="例如：/about 或 https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
              />
              <Label htmlFor="enabled">启用此菜单</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              {editingMenu ? '保存修改' : '添加菜单'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除这个菜单项吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
