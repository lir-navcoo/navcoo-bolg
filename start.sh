#!/bin/bash

# 个人博客启动脚本

echo "🚀 正在启动个人博客系统..."

# 启动后端
echo "📦 启动后端服务..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 10

# 启动前端
echo "🎨 启动前端服务..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ 服务已启动！"
echo "   前台首页: http://localhost:5173"
echo "   管理后台: http://localhost:5173/admin"
echo "   后端API: http://localhost:8080/api"
echo ""
echo "   默认账号: admin / admin123"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待信号
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
