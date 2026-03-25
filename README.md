# 个人博客系统 / Personal Blog System

<div align="center">

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-green?logo=spring)
![MySQL](https://img.shields.io/badge/MySQL-8-orange?logo=mysql)
![License](https://img.shields.io/badge/License-MIT-yellow)

**一个现代化的个人博客系统**，采用 React + shadcn/ui 前端 + Spring Boot 后端架构，支持富文本编辑、媒体库管理、收藏分享等功能。

**A modern personal blog system** built with React + shadcn/ui frontend and Spring Boot backend, featuring rich text editing, media library management, and favorites sharing.

</div>

---

## ✨ 功能特性 / Features

| 模块 Module | 功能 Feature | 说明 Description |
|:---|:---|:---|
| 📖 **文章系统** / Article System | 浏览、发布、编辑、删除 / View, publish, edit, delete | 支持富文本编辑，自动提取摘要 / Rich text editing with auto abstract extraction |
| 🏷️ **分类标签** / Categories & Tags | 多级分类、标签管理 / Multi-level categories, tag management | 支持按分类/标签筛选文章 / Filter articles by category or tag |
| 📷 **媒体库** / Media Library | 图片上传与管理 / Image upload & management | 按文章分组，支持批量上传 / Grouped by article, batch upload supported |
| 📊 **数据统计** / Statistics | 浏览量、收藏量统计 / View & favorite counts | 实时统计文章热度 / Real-time article popularity tracking |
| 🎨 **主题切换** / Theme Toggle | 亮色/暗色模式 / Light/Dark mode | 一键切换，跟随系统 / One-click switch, follows system setting |
| 🔐 **用户认证** / User Auth | JWT 令牌登录 / JWT token login | 安全的认证机制 / Secure authentication |
| ⭐ **收藏分享** / Favorites & Share | 收藏文章、复制链接 / Favorite articles, copy link | 便捷的内容分享 / Easy content sharing |
| 🔖 **书签功能** / Bookmark | 浏览器书签 / Browser bookmark | 一键添加到浏览器书签 / Add to browser bookmarks instantly |

---

## 🛠️ 技术栈 / Tech Stack

### 前端技术 / Frontend

- **框架 / Framework**：React 18 + TypeScript
- **构建 / Build**：Vite 5
- **组件库 / UI Library**：shadcn/ui + Radix UI
- **样式 / Styling**：Tailwind CSS
- **编辑器 / Editor**：AIEditor（富文本编辑 / Rich text editing）
- **HTTP 客户端 / HTTP Client**：Axios
- **国际化 / i18n**：i18next
- **状态管理 / State**：Zustand

### 后端技术 / Backend

- **框架 / Framework**：Spring Boot 3
- **安全 / Security**：Spring Security + JWT
- **ORM**：MyBatis-Plus
- **数据库 / Database**：MySQL 8.0
- **构建 / Build**：Maven

---

## 🚀 快速开始 / Quick Start

### 环境要求 / Prerequisites

| 软件 Software | 版本 Version | 说明 Description |
|:---|:---|:---|
| Node.js | 18+ | 前端运行环境 / Frontend runtime |
| JDK | 17+ | 后端运行环境 / Backend runtime |
| MySQL | 8.0+ | 数据库服务 / Database service |
| Maven | 3.8+ | 后端构建工具 / Backend build tool |
| pnpm | Latest / 最新 | 前端包管理器 / Frontend package manager |

### 安装步骤 / Installation

**1. 克隆项目 / Clone the project**

```bash
git clone https://gitee.com/li78080114/navcoo-blog.git
cd navcoo-blog
```

**2. 配置数据库 / Configure database**

```sql
-- 登录 MySQL / Login to MySQL
mysql -u root -p

-- 创建数据库 / Create database
CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**3. 启动后端 / Start backend**

```bash
cd backend
./mvnw spring-boot:run
```

后端运行在 **http://localhost:8080** / Backend runs at **http://localhost:8080**

**4. 启动前端 / Start frontend**

```bash
cd frontend
pnpm install
pnpm dev
```

前端运行在 **http://localhost:5173** / Frontend runs at **http://localhost:5173**

**5. 访问系统 / Access the system**

| 页面 Page | 地址 URL | 说明 Description |
|:---|:---|:---|
| 首页 / Home | http://localhost:5173 | 博客文章列表 / Blog article list |
| 管理后台 / Admin | http://localhost:5173/admin | 文章、分类、标签、媒体管理 / Manage articles, categories, tags, media |

> **默认管理员账号 / Default admin account**：`admin` / `admin123`

---

## 📁 项目结构 / Project Structure

```
navcoo-blog/
├── frontend/                         # React 前端项目 / React frontend
│   ├── src/
│   │   ├── components/              # UI 组件 / UI components
│   │   │   ├── ui/                 # shadcn/ui 基础组件 / Base components
│   │   │   ├── editor/             # 富文本编辑器 / Rich text editor
│   │   │   ├── layout/             # 布局组件 / Layout components
│   │   │   └── media/              # 媒体选择器 / Media selector
│   │   ├── pages/                  # 页面组件 / Page components
│   │   │   ├── admin/              # 管理后台页面 / Admin pages
│   │   │   ├── ArticlePage.tsx     # 文章详情 / Article detail
│   │   │   ├── ArticlesPage.tsx     # 文章列表 / Article list
│   │   │   ├── HomePage.tsx        # 首页 / Home page
│   │   │   └── LoginPage.tsx       # 登录页 / Login page
│   │   ├── lib/                    # 工具函数 / Utilities
│   │   │   └── api.ts              # API 接口封装 / API wrapper
│   │   ├── stores/                 # 状态管理 / State management
│   │   └── types/                  # TypeScript 类型定义 / Type definitions
│   └── package.json
│
└── backend/                         # Spring Boot 后端项目 / Spring Boot backend
    └── src/main/java/com/blog/
        ├── controller/              # REST API 控制器 / REST API controllers
        │   ├── ArticleController    # 文章接口 / Article API
        │   ├── AuthController       # 认证接口 / Auth API
        │   ├── CategoryController   # 分类接口 / Category API
        │   ├── MediaController      # 媒体接口 / Media API
        │   └── ...
        ├── service/                 # 业务逻辑层 / Business logic layer
        ├── mapper/                  # 数据访问层 / Data access layer
        ├── entity/                  # 实体类 / Entities
        ├── dto/                     # 数据传输对象 / Data transfer objects
        ├── config/                  # 配置类 / Configuration classes
        └── security/                # 安全相关 / Security related
```

---

## ⚙️ 配置说明 / Configuration

### 数据库配置 / Database Configuration

编辑 `backend/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
```

### API 地址配置 / API Configuration

编辑 `frontend/src/lib/api.ts`：

```typescript
const API_BASE = 'http://localhost:8080/api'
```

### 文件存储路径 / File Storage

默认存储路径 / Default path：`/Users/lirui/Documents/project/blog/uploads/`

- `common/` — 公共媒体资源 / Public media files
- `{articleId}/` — 归属于特定文章的媒体 / Article-specific media

---

## ❓ 常见问题 / FAQ

**Q: 后端启动失败，数据库连接错误？** / **Q: Backend fails to start, database connection error?**

确认 MySQL 服务已启动，且密码配置正确。/ Make sure MySQL is running and the password is configured correctly.

---

**Q: 前端无法访问后端 API？** / **Q: Frontend cannot access backend API?**

检查后端是否运行在 8080 端口，确认 CORS 配置正确。/ Check if backend is running on port 8080 and CORS is configured correctly.

---

**Q: 图片上传失败？** / **Q: Image upload fails?**

检查 `uploads/` 目录是否存在且有写入权限。/ Check if the `uploads/` directory exists and has write permissions.

---

**Q: pnpm 安装依赖失败？** / **Q: pnpm install fails?**

切换镜像源 / Switch mirror：`pnpm config set registry https://registry.npmmirror.com`

---

## 📄 License

本项目基于 [MIT License](LICENSE) 开源。/ This project is open source under [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by [李睿](https://gitee.com/li78080114)

</div>
