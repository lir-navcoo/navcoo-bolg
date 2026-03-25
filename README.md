# 个人博客系统

一个现代化的个人博客系统，采用 React + shadcn/ui 前端 + Spring Boot 后端架构。

## 功能特性

- 📖 **文章浏览**：公开访问已发布的文章，无需登录
- ✍️ **文章管理**：登录后可发布、编辑、删除文章
- 🎨 **富文本编辑**：使用 AIEditor 实现文章编辑
- 📊 **数据统计**：查看文章浏览量、分类统计等
- 🎯 **现代化UI**：基于 shadcn/ui 的组件化设计
- 🌙 **暗色模式**：支持暗色主题
- 📱 **响应式设计**：完美适配各种设备
- 📷 **媒体库**：图片上传管理与文章关联
- ⭐ **收藏功能**：收藏喜欢的文章

## 技术栈

### 前端
- React 18 + TypeScript
- Vite 构建工具
- shadcn/ui 组件库
- Tailwind CSS
- AIEditor 富文本编辑器
- Axios HTTP 客户端

### 后端
- Spring Boot 3
- Spring Security + JWT 认证
- MyBatis-Plus
- MySQL 数据库

## 快速开始

### 1. 环境要求

- Node.js 18+
- JDK 17+
- MySQL 8.0+
- Maven 3.8+

### 2. 数据库配置

创建 MySQL 数据库：

```sql
CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 启动后端

```bash
cd backend
./mvnw spring-boot:run
```

### 4. 启动前端

```bash
cd frontend
pnpm install
pnpm dev
```

### 5. 访问系统

- 前台首页：http://localhost:5173
- 管理后台：http://localhost:5173/admin
- 默认管理员账号：`admin` / `admin123`

## 项目结构

```
blog/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── components/      # React 组件
│   │   ├── pages/           # 页面组件
│   │   └── lib/             # 工具函数
│   └── ...
│
└── backend/                 # 后端项目
    └── src/main/java/com/blog/
        ├── controller/      # REST API 控制器
        ├── service/         # 业务逻辑层
        ├── mapper/          # 数据访问层
        ├── entity/          # 实体类
        └── ...
```

## License

MIT
