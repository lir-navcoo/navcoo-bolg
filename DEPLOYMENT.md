# 个人博客系统部署指南

本文档详细介绍如何从零开始部署个人博客系统，包括开发环境配置和生产环境部署。

---

## 一、环境要求

部署本系统前，请确保已安装以下软件：

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | 18+ | 前端运行环境 |
| JDK | 17+ | 后端 Java 运行环境 |
| MySQL | 8.0+ | 数据库服务 |
| Maven | 3.8+ | 后端项目构建工具 |
| pnpm | 最新版 | 前端包管理器（推荐）或 npm |

---

## 二、项目结构

```
blog/
├── frontend/          # React 前端项目
│   ├── src/          # 源代码
│   ├── public/       # 静态资源
│   └── package.json  # 前端依赖配置
├── backend/          # Spring Boot 后端项目
│   ├── src/          # Java 源代码
│   ├── pom.xml       # Maven 依赖配置
│   └── uploads/      # 媒体文件上传目录
├── uploads/          # 博客图片存储目录
└── start.sh          # 一键启动脚本
```

---

## 三、开发环境部署

### 3.1 克隆项目

```bash
git clone <repository_url>
cd blog
```

### 3.2 数据库配置

#### 3.2.1 安装并启动 MySQL

使用 Homebrew 安装（macOS）：

```bash
brew install mysql
brew services start mysql
```

#### 3.2.2 创建数据库

```bash
mysql -u root -p
```

在 MySQL 命令行中执行：

```sql
CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 3.2.3 配置数据库连接

编辑 `backend/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true&useSSL=false
    username: root
    password: your_password
```

> **注意**：请将 `your_password` 替换为你的 MySQL 密码。

### 3.3 启动后端服务

#### 方式一：使用 Maven（推荐）

```bash
cd backend
./mvnw spring-boot:run
```

#### 方式二：使用启动脚本

```bash
cd blog
./start.sh
```

后端服务启动后运行在 **http://localhost:8080**

### 3.4 启动前端服务

#### 3.4.1 安装依赖

```bash
cd frontend
pnpm install
```

> 如果使用 npm：
> ```bash
> npm install
> ```

#### 3.4.2 配置 API 地址

前端配置文件 `frontend/src/lib/api.ts` 中配置后端 API 地址：

```typescript
const API_BASE_URL = 'http://localhost:8080';
```

#### 3.4.3 启动开发服务器

```bash
pnpm dev
```

前端服务启动后访问 **http://localhost:5173**

### 3.5 访问系统

| 页面 | 地址 | 说明 |
|------|------|------|
| 首页 | http://localhost:5173 | 博客文章列表 |
| 文章详情 | http://localhost:5173/article/{id} | 阅读文章 |
| 管理后台 | http://localhost:5173/admin | 管理员登录 |
| 登录页面 | http://localhost:5173/login | 用户登录 |

**默认管理员账号**：`admin` / `admin123`

---

## 四、生产环境部署

### 4.1 服务器环境准备

推荐配置：

- CPU：2 核以上
- 内存：4GB 以上
- 系统：Ubuntu 20.04+ / CentOS 7+ / macOS

### 4.2 安装软件

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk mysql-server nginx nodejs npm

# CentOS
sudo yum install java-17-openjdk mysql-server nginx nodejs npm

# macOS
brew install openjdk@17 mysql nginx node
```

### 4.3 构建后端

```bash
cd backend
./mvnw clean package -DskipTests
```

构建完成后，JAR 包位于 `backend/target/blog-0.0.1-SNAPSHOT.jar`

### 4.4 配置后端服务

创建 systemd 服务文件 `/etc/systemd/system/blog-backend.service`：

```ini
[Unit]
Description=Blog Backend Service
After=network.target mysql.service

[Service]
Type=simple
User=your_user
WorkingDirectory=/path/to/blog/backend
ExecStart=/usr/bin/java -jar target/blog-0.0.1-SNAPSHOT.jar
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable blog-backend
sudo systemctl start blog-backend
```

### 4.5 构建前端

```bash
cd frontend
pnpm install
pnpm build
```

构建产物位于 `frontend/dist/`

### 4.6 配置 Nginx

编辑 `/etc/nginx/sites-available/blog`：

```nginx
server {
    listen 80;
    server_name your_domain.com;

    # 前端静态文件
    root /path/to/blog/frontend/dist;
    index index.html;

    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 媒体文件
    location /uploads {
        alias /path/to/blog/uploads;
        expires 30d;
    }
}
```

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4.7 配置 HTTPS（可选但推荐）

使用 Let's Encrypt 免费证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

---

## 五、数据备份

### 5.1 数据库备份

```bash
mysqldump -u root -p blog > backup_$(date +%Y%m%d).sql
```

### 5.2 文件备份

```bash
tar -czf blog_backup_$(date +%Y%m%d).tar.gz /path/to/blog/uploads
```

---

## 六、常见问题

### Q1: 后端启动失败，提示数据库连接错误

检查以下内容：

1. MySQL 服务是否启动：`sudo systemctl status mysql`
2. 数据库是否创建：`SHOW DATABASES;`
3. 数据库密码是否正确
4. 检查 `application.yml` 中的连接信息

### Q2: 前端无法访问后端 API

1. 确认后端服务运行在 8080 端口：`curl http://localhost:8080/api/articles`
2. 检查前端 API 配置是否正确
3. 如果是跨域问题，确认后端已配置 CORS

### Q3: 图片上传失败

1. 检查 `uploads/` 目录权限：`chmod 755 uploads/`
2. 确认目录存在且可写
3. 检查 Nginx 配置中的 `client_max_body_size`

### Q4: pnpm 安装依赖失败

切换镜像源：

```bash
pnpm config set registry https://registry.npmmirror.com
```

---

## 七、安全建议

1. **修改默认密码**：首次部署后立即修改管理员密码
2. **配置防火墙**：仅开放 80/443 端口
3. **启用 HTTPS**：生产环境务必使用 HTTPS
4. **定期备份**：配置自动备份任务
5. **日志监控**：定期检查应用日志

---

## 八、联系方式

如有问题，请在项目 Issue 页面提交。

---

*文档更新日期：2026-03-26*
