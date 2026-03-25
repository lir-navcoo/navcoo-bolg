import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldAlert } from 'lucide-react'

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 p-4">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-md relative">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">注册功能已关闭</CardTitle>
          <CardDescription>
            系统不支持自助注册，请联系管理员获取账号
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground mb-2">默认管理员账号：</p>
            <p className="font-mono text-sm">用户名：admin</p>
            <p className="font-mono text-sm">密码：admin123</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link to="/login">
              返回登录页
            </Link>
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            已有账号？{' '}
            <Link to="/login" className="text-primary hover:underline">
              立即登录
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
