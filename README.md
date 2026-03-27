# 个人博客系统

> 🌐 **英文版**: [README.en.md](README.en.md)

<div align="center">

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-green?logo=spring)
![MySQL](https://img.shields.io/badge/MySQL-8-orange?logo=mysql)
![License](https://img.shields.io/badge/License-MIT-yellow)

**一个现代化的个人博客系统**，采用 React + shadcn/ui 前端 + Spring Boot 后端架构，支持富文本编辑、媒体库管理、收藏分享等功能。

[![Star](https://img.shields.io/github/stars/lir-navcoo/navcoo-bolg?style=social)](https://github.com/lir-navcoo/navcoo-bolg)
[![Fork](https://img.shields.io/github/forks/lir-navcoo/navcoo-bolg?style=social)](https://github.com/lir-navcoo/navcoo-bolg)

</div>

---

## ✨ 功能特性

| 模块 | 功能 | 说明 |
|:---|:---|:---|
| 📖 **文章系统** | 浏览、发布、编辑、删除 | 支持富文本编辑，自动提取摘要 |
| 🏷️ **分类标签** | 多级分类、标签管理 | 支持按分类/标签筛选文章 |
| 📷 **媒体库** | 图片上传与管理 | 按文章分组，支持批量上传 |
| 📊 **数据统计** | 浏览量、收藏量统计 | 实时统计文章热度 |
| 🎨 **主题切换** | 亮色/暗色模式 | 一键切换，跟随系统 |
| 🔐 **用户认证** | JWT 令牌登录 | 安全的认证机制 |
| ⭐ **收藏分享** | 收藏文章、复制链接 | 便捷的内容分享 |
| 🔖 **书签功能** | 浏览器书签 | 一键添加到浏览器书签 |

---

## 🛠️ 技术栈

### 前端技术

- **框架**：React 18 + TypeScript
- **构建**：Vite 5
- **组件库**：shadcn/ui + Radix UI
- **样式**：Tailwind CSS
- **编辑器**：AIEditor（富文本编辑）
- **HTTP 客户端**：Axios
- **国际化**：i18next
- **状态管理**：Zustand

### 后端技术

- **框架**：Spring Boot 3
- **安全**：Spring Security + JWT
- **ORM**：MyBatis-Plus
- **数据库**：MySQL 8.0
- **构建**：Maven

---

## 🚀 快速开始

### 环境要求

| 软件 | 版本 | 说明 |
|:---|:---|:---|
| Node.js | 18+ | 前端运行环境 |
| JDK | 17+ | 后端运行环境 |
| MySQL | 8.0+ | 数据库服务 |
| Maven | 3.8+ | 后端构建工具 |
| pnpm | 最新 | 前端包管理器 |

### 安装步骤

**1. 克隆项目**

```bash
git clone https://github.com/lir-navcoo/navcoo-bolg.git
cd navcoo-bolg
```

**2. 配置数据库**

```sql
-- 登录 MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**3. 启动后端**

```bash
cd backend
./mvnw spring-boot:run
```

后端运行在 **http://localhost:8080**

**4. 启动前端**

```bash
cd frontend
pnpm install
pnpm dev
```

前端运行在 **http://localhost:5173**

**5. 访问系统**

| 页面 | 地址 | 说明 |
|:---|:---|:---|
| 首页 | http://localhost:5173 | 博客文章列表 |
| 管理后台 | http://localhost:5173/admin | 文章、分类、标签、媒体管理 |

> **默认管理员账号**：`admin` / `admin123`

---

## 📁 项目结构

```
navcoo-blog/
├── frontend/                         # React 前端项目
│   ├── src/
│   │   ├── components/              # UI 组件
│   │   │   ├── ui/                 # shadcn/ui 基础组件
│   │   │   ├── editor/             # 富文本编辑器
│   │   │   ├── layout/             # 布局组件
│   │   │   └── media/              # 媒体选择器
│   │   ├── pages/                  # 页面组件
│   │   │   ├── admin/              # 管理后台页面
│   │   │   ├── ArticlePage.tsx     # 文章详情
│   │   │   ├── ArticlesPage.tsx     # 文章列表
│   │   │   ├── HomePage.tsx        # 首页
│   │   │   └── LoginPage.tsx       # 登录页
│   │   ├── lib/                    # 工具函数
│   │   │   └── api.ts              # API 接口封装
│   │   ├── stores/                 # 状态管理
│   │   └── types/                  # TypeScript 类型定义
│   └── package.json
│
└── backend/                         # Spring Boot 后端项目
    └── src/main/java/com/blog/
        ├── controller/              # REST API 控制器
        │   ├── ArticleController    # 文章接口
        │   ├── AuthController       # 认证接口
        │   ├── CategoryController   # 分类接口
        │   ├── MediaController      # 媒体接口
        │   └── ...
        ├── service/                 # 业务逻辑层
        ├── mapper/                  # 数据访问层
        ├── entity/                  # 实体类
        ├── dto/                     # 数据传输对象
        ├── config/                  # 配置类
        └── security/                # 安全相关
```

---

## ⚙️ 配置说明

### 数据库配置

编辑 `backend/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
  sql:
    init:
      mode: always        # 启动时自动初始化数据库
      continue-on-error: true
```

> **自动初始化说明**：
> - 启动后端时会自动执行 `init.sql` 脚本
> - 仅创建不存在的表（使用 `IF NOT EXISTS`）
> - 仅插入不存在的初始数据（使用 `INSERT IGNORE`）
> - **不会删除已有数据**，可安全重复启动

### API 地址配置

编辑 `frontend/src/lib/api.ts`：

```typescript
const API_BASE = 'http://localhost:8080/api'
```

### 文件存储路径

默认存储路径：`/Users/lirui/Documents/navcoo-blog/blog/uploads/`

- `common/` — 公共媒体资源
- `{articleId}/` — 归属于特定文章的媒体

---

## ❓ 常见问题

**Q: 后端启动失败，数据库连接错误？**

确认 MySQL 服务已启动，且密码配置正确。

**Q: 前端无法访问后端 API？**

检查后端是否运行在 8080 端口，确认 CORS 配置正确。

**Q: 图片上传失败？**

检查 `uploads/` 目录是否存在且有写入权限。

**Q: pnpm 安装依赖失败？**

切换镜像源：`pnpm config set registry https://registry.npmmirror.com`

---

## 📄 License

本项目基于 [MIT License](LICENSE) 开源。

---

## 🔗 相关链接

| 平台 | 仓库地址 |
|:---|:---|
| GitHub | https://github.com/lir-navcoo/navcoo-bolg |

> 🌐 **英文版**: [README.en.md](README.en.md)
