import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { useMenuStore, type MenuItem } from '@/stores/menuStore'
import { userApi } from '@/lib/api'
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Mail,
  Key,
  Users,
  Save,
  Loader2,
  Camera,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Menu as MenuIcon,
  Trash2,
  Plus,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Edit2,
} from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SiteSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  postsPerPage: number
  allowComments: boolean
  requireReview: boolean
  enableRss: boolean
}

interface UserProfile {
  username: string
  nickname: string
  avatar: string
  bio: string
}

export function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    username: user?.username || 'admin',
    nickname: user?.nickname || '管理员',
    avatar: user?.avatar || '',
    bio: user?.bio || ''
  })
  
  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // Site settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: '我的博客',
    siteDescription: '分享技术，记录生活',
    siteUrl: 'https://example.com',
    postsPerPage: 10,
    allowComments: true,
    requireReview: false,
    enableRss: true
  })

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const res = await userApi.updateCurrentUser({
        nickname: profile.nickname,
        avatar: profile.avatar,
        bio: profile.bio,
      })
      if (res.success) {
        toast.success('个人信息已保存')
        // 更新本地存储的用户信息
        updateUser({
          nickname: profile.nickname,
          avatar: profile.avatar,
          bio: profile.bio,
        })
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwords.currentPassword) {
      toast.error('请输入当前密码')
      return
    }
    if (passwords.newPassword.length < 6) {
      toast.error('新密码长度至少6位')
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('两次输入的密码不一致')
      return
    }

    try {
      setSaving(true)
      const res = await userApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
      if (res.success) {
        toast.success('密码修改成功')
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || '修改失败')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSiteSettings = async () => {
    try {
      setSaving(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('站点设置已保存')
    } catch (error) {
      toast.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10">
          <Settings className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
          <p className="text-muted-foreground">管理博客的配置和账户信息</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[750px]">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">个人信息</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">安全设置</span>
          </TabsTrigger>
          <TabsTrigger value="site" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">站点设置</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">通知</span>
          </TabsTrigger>
          <TabsTrigger value="menu" className="gap-2">
            <MenuIcon className="h-4 w-4" />
            <span className="hidden sm:inline">菜单</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                个人信息
              </CardTitle>
              <CardDescription>
                管理您的个人资料和公开显示的信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-xl">
                    {profile.nickname?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="h-4 w-4" />
                    更换头像
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    支持 JPG、PNG 格式，最大 2MB
                  </p>
                </div>
              </div>
              
              <Separator />
              
              {/* Form Fields */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">用户名</label>
                  <Input 
                    value={profile.username} 
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    用户名用于登录，不可更改
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">昵称</label>
                  <Input 
                    placeholder="输入您的昵称"
                    value={profile.nickname} 
                    onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                  />
                </div>
                
                </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">简介</label>
                <textarea
                  className="flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                  placeholder="介绍一下自己..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      保存更改
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                修改密码
              </CardTitle>
              <CardDescription>
                定期更换密码可以提高账户安全性
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">当前密码</label>
                <div className="relative">
                  <Input 
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="输入当前密码"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">新密码</label>
                <div className="relative">
                  <Input 
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="输入新密码"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwords.newPassword && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwords.newPassword.length >= 6 ? (
                      <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> 密码强度：安全
                      </span>
                    ) : (
                      <span className="text-amber-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> 密码长度至少6位
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">确认新密码</label>
                <div className="relative">
                  <Input 
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="再次输入新密码"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                  <p className="text-xs text-destructive">两次输入的密码不一致</p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleChangePassword} disabled={saving} className="gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      修改中...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4" />
                      修改密码
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Options */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                安全选项
              </CardTitle>
              <CardDescription>
                管理其他安全设置
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Key className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">双因素认证</p>
                    <p className="text-sm text-muted-foreground">启用后登录需要手机验证码</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">未启用</Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">登录设备管理</p>
                    <p className="text-sm text-muted-foreground">查看和管理已登录的设备</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">查看</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Settings Tab */}
        <TabsContent value="site" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                站点设置
              </CardTitle>
              <CardDescription>
                配置博客的基本信息和显示选项
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">站点名称</label>
                  <Input 
                    placeholder="我的博客"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">站点地址</label>
                  <Input 
                    placeholder="https://example.com"
                    value={siteSettings.siteUrl}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">站点描述</label>
                <Input 
                  placeholder="简短描述您的博客"
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">每页文章数</label>
                <Input 
                  type="number"
                  min={5}
                  max={50}
                  value={siteSettings.postsPerPage}
                  onChange={(e) => setSiteSettings({ ...siteSettings, postsPerPage: parseInt(e.target.value) || 10 })}
                  className="w-32"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">允许评论</p>
                    <p className="text-sm text-muted-foreground">访客可以在文章下发表评论</p>
                  </div>
                  <Switch 
                    checked={siteSettings.allowComments}
                    onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, allowComments: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">审核评论</p>
                    <p className="text-sm text-muted-foreground">新评论需要审核后才能显示</p>
                  </div>
                  <Switch 
                    checked={siteSettings.requireReview}
                    onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, requireReview: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">启用 RSS</p>
                    <p className="text-sm text-muted-foreground">允许用户订阅您的博客</p>
                  </div>
                  <Switch 
                    checked={siteSettings.enableRss}
                    onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, enableRss: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSiteSettings} disabled={saving} className="gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      保存设置
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                通知设置
              </CardTitle>
              <CardDescription>
                配置您希望接收的通知类型
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">评论通知</p>
                    <p className="text-sm text-muted-foreground">有人评论时发送邮件通知</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Users className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">新用户通知</p>
                    <p className="text-sm text-muted-foreground">有新用户注册时发送通知</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">系统通知</p>
                    <p className="text-sm text-muted-foreground">系统更新和维护通知</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Menu Management Tab */}
        <TabsContent value="menu" className="space-y-6">
          <MenuManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Menu Management Component
function MenuManagement() {
  const { menus, addMenu, updateMenu, deleteMenu, reorderMenu } = useMenuStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null)
  const [newMenu, setNewMenu] = useState({ name: '', nameEn: '', url: '', order: menus.length + 1, enabled: true })

  const handleAddMenu = () => {
    if (!newMenu.name || !newMenu.url) {
      toast.error('请填写菜单名称和链接地址')
      return
    }
    addMenu(newMenu)
    setNewMenu({ name: '', nameEn: '', url: '', order: menus.length + 1, enabled: true })
    setIsAddDialogOpen(false)
    toast.success('菜单项添加成功')
  }

  const handleUpdateMenu = () => {
    if (!editingMenu) return
    if (!editingMenu.name || !editingMenu.url) {
      toast.error('请填写菜单名称和链接地址')
      return
    }
    updateMenu(editingMenu.id, editingMenu)
    setEditingMenu(null)
    toast.success('菜单项更新成功')
  }

  const handleDeleteMenu = (id: string) => {
    deleteMenu(id)
    toast.success('菜单项已删除')
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const menu = menus[index]
    const prevMenu = menus[index - 1]
    reorderMenu(menu.id, prevMenu.order)
  }

  const moveDown = (index: number) => {
    if (index === menus.length - 1) return
    const menu = menus[index]
    const nextMenu = menus[index + 1]
    reorderMenu(menu.id, nextMenu.order)
  }

  const sortedMenus = [...menus].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>导航菜单管理</CardTitle>
              <CardDescription>
                自定义顶部导航栏的菜单项，支持拖拽排序
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              添加菜单
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
              <div className="col-span-1">排序</div>
              <div className="col-span-3">中文名称</div>
              <div className="col-span-3">英文名称</div>
              <div className="col-span-3">链接</div>
              <div className="col-span-1 text-center">显示</div>
              <div className="col-span-1 text-center">操作</div>
            </div>
            <div className="divide-y">
              {sortedMenus.map((menu, index) => (
                <div key={menu.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                  <div className="col-span-1 flex items-center gap-1">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveDown(index)}
                      disabled={index === sortedMenus.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="col-span-3 font-medium">{menu.name}</div>
                  <div className="col-span-3 text-muted-foreground">{menu.nameEn}</div>
                  <div className="col-span-3">
                    <a
                      href={menu.url}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                      onClick={(e) => { e.preventDefault(); }}
                    >
                      {menu.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Switch
                      checked={menu.enabled}
                      onCheckedChange={(checked) => updateMenu(menu.id, { enabled: checked })}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingMenu(menu)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteMenu(menu.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Menu Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加菜单项</DialogTitle>
            <DialogDescription>
              添加新的导航菜单项
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">中文名称 *</Label>
              <Input
                id="new-name"
                value={newMenu.name}
                onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                placeholder="例如：首页"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-name-en">英文名称</Label>
              <Input
                id="new-name-en"
                value={newMenu.nameEn}
                onChange={(e) => setNewMenu({ ...newMenu, nameEn: e.target.value })}
                placeholder="例如：Home"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-url">链接地址 *</Label>
              <Input
                id="new-url"
                value={newMenu.url}
                onChange={(e) => setNewMenu({ ...newMenu, url: e.target.value })}
                placeholder="例如：/ 或 /articles"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddMenu}>添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Dialog */}
      <Dialog open={!!editingMenu} onOpenChange={() => setEditingMenu(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑菜单项</DialogTitle>
            <DialogDescription>
              修改菜单项信息
            </DialogDescription>
          </DialogHeader>
          {editingMenu && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">中文名称 *</Label>
                <Input
                  id="edit-name"
                  value={editingMenu.name}
                  onChange={(e) => setEditingMenu({ ...editingMenu, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name-en">英文名称</Label>
                <Input
                  id="edit-name-en"
                  value={editingMenu.nameEn}
                  onChange={(e) => setEditingMenu({ ...editingMenu, nameEn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-url">链接地址 *</Label>
                <Input
                  id="edit-url"
                  value={editingMenu.url}
                  onChange={(e) => setEditingMenu({ ...editingMenu, url: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMenu(null)}>
              取消
            </Button>
            <Button onClick={handleUpdateMenu}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
