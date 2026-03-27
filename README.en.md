# Personal Blog System

> 🌐 Chinese Version: [README.md](README.md)

<div align="center">

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-green?logo=spring)
![MySQL](https://img.shields.io/badge/MySQL-8-orange?logo=mysql)
![License](https://img.shields.io/badge/License-MIT-yellow)

**A modern personal blog system** built with React + shadcn/ui frontend and Spring Boot backend, featuring rich text editing, media library management, favorites sharing, and more.

[![Star](https://img.shields.io/badge/Star-GitHub-blue?logo=github)](https://github.com/lir-navcoo/navcoo-bolg)
[![Fork](https://img.shields.io/badge/Fork-GitHub-blue?logo=github)](https://github.com/lir-navcoo/navcoo-bolg)

</div>

---

## ✨ Features

| Module | Feature | Description |
|:---|:---|:---|
| 📖 **Article System** | View, publish, edit, delete | Rich text editing with auto abstract extraction |
| 🏷️ **Categories & Tags** | Multi-level categories, tag management | Filter articles by category or tag |
| 📷 **Media Library** | Image upload & management | Grouped by article, batch upload supported |
| 📊 **Statistics** | View & favorite counts | Real-time article popularity tracking |
| 🎨 **Theme Toggle** | Light/Dark mode | One-click switch, follows system setting |
| 🔐 **User Auth** | JWT token login | Secure authentication mechanism |
| ⭐ **Favorites & Share** | Favorite articles, copy link | Easy content sharing |
| 🔖 **Bookmark** | Browser bookmark | Add to browser bookmarks instantly |

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 + TypeScript
- **Build**: Vite 5
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Editor**: AIEditor (Rich text editing)
- **HTTP Client**: Axios
- **i18n**: i18next
- **State Management**: Zustand

### Backend

- **Framework**: Spring Boot 3
- **Security**: Spring Security + JWT
- **ORM**: MyBatis-Plus
- **Database**: MySQL 8.0
- **Build**: Maven

---

## 🚀 Quick Start

### Prerequisites

| Software | Version | Description |
|:---|:---|:---|
| Node.js | 18+ | Frontend runtime |
| JDK | 17+ | Backend runtime |
| MySQL | 8.0+ | Database service |
| Maven | 3.8+ | Backend build tool |
| pnpm | Latest | Frontend package manager |

### Installation

**1. Clone the project**

```bash
git clone https://github.com/lir-navcoo/navcoo-bolg.git
cd navcoo-bolg
```

**2. Configure database**

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**3. Start backend**

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs at **http://localhost:8080**

**4. Start frontend**

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs at **http://localhost:5173**

**5. Access the system**

| Page | URL | Description |
|:---|:---|:---|
| Home | http://localhost:5173 | Blog article list |
| Admin | http://localhost:5173/admin | Manage articles, categories, tags, media |

> **Default admin account**: `admin` / `admin123`

---

## 📁 Project Structure

```
navcoo-blog/
├── frontend/                         # React frontend project
│   ├── src/
│   │   ├── components/              # UI components
│   │   │   ├── ui/                 # shadcn/ui base components
│   │   │   ├── editor/             # Rich text editor
│   │   │   ├── layout/             # Layout components
│   │   │   └── media/              # Media selector
│   │   ├── pages/                  # Page components
│   │   │   ├── admin/              # Admin pages
│   │   │   ├── ArticlePage.tsx     # Article detail
│   │   │   ├── ArticlesPage.tsx     # Article list
│   │   │   ├── HomePage.tsx        # Home page
│   │   │   └── LoginPage.tsx       # Login page
│   │   ├── lib/                    # Utilities
│   │   │   └── api.ts              # API wrapper
│   │   ├── stores/                 # State management
│   │   └── types/                  # Type definitions
│   └── package.json
│
└── backend/                         # Spring Boot backend
    └── src/main/java/com/blog/
        ├── controller/              # REST API controllers
        │   ├── ArticleController    # Article API
        │   ├── AuthController       # Auth API
        │   ├── CategoryController   # Category API
        │   ├── MediaController      # Media API
        │   └── ...
        ├── service/                 # Business logic layer
        ├── mapper/                  # Data access layer
        ├── entity/                  # Entities
        ├── dto/                     # Data transfer objects
        ├── config/                  # Configuration classes
        └── security/                # Security related
```

---

## ⚙️ Configuration

### Database Configuration

Edit `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
  sql:
    init:
      mode: always        # Auto-initialize database on startup
      continue-on-error: true
```

> **Auto-initialization notes**:
> - Backend automatically executes `init.sql` on startup
> - Only creates tables that don't exist (using `IF NOT EXISTS`)
> - Only inserts initial data that doesn't exist (using `INSERT IGNORE`)
> - **Won't delete existing data**, safe to restart

### API Configuration

Edit `frontend/src/lib/api.ts`:

```typescript
const API_BASE = 'http://localhost:8080/api'
```

### File Storage

Default path: `{project-root}/uploads/`

- `common/` — Public media files
- `{articleId}/` — Article-specific media

---

## ❓ FAQ

**Q: Backend fails to start, database connection error?**

Make sure MySQL is running and the password is configured correctly.

---

**Q: Frontend cannot access backend API?**

Check if backend is running on port 8080 and CORS is configured correctly.

---

**Q: Image upload fails?**

Check if the `uploads/` directory exists and has write permissions.

---

**Q: pnpm install fails?**

Switch mirror: `pnpm config set registry https://registry.npmmirror.com`

---

## 📄 License

This project is open source under [MIT License](LICENSE).

---

## 🔗 Links

| Platform | Repository |
|:---|:---|
| GitHub | https://github.com/lir-navcoo/navcoo-bolg |

> 🌐 Chinese Version: [README.md](README.md)

---

<div align="center">

Made with ❤️ by [Li Rui](https://github.com/lir-navcoo)

</div>
