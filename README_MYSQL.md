# MySQL 数据库设置指南

## 方法一：使用 Homebrew 安装 MySQL（推荐）

```bash
# 安装 MySQL
brew install mysql

# 启动 MySQL 服务
brew services start mysql

# 设置 root 密码
mysql_secure_installation
# 或直接设置密码
mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';"
```

## 方法二：使用 Docker 运行 MySQL

```bash
# 安装 Docker Desktop（如果未安装）
# 下载地址：https://www.docker.com/products/docker-desktop/

# 拉取并运行 MySQL 容器
docker run -d \
  --name blog-mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=blog \
  -v ~/mysql_data:/var/lib/mysql \
  mysql:8.0
```

## 数据库初始化

### 1. 创建数据库

```bash
mysql -u root -proot123
```

在 MySQL 命令行中执行：

```sql
CREATE DATABASE IF NOT EXISTS blog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blog;
```

### 2. 运行初始化脚本

```bash
mysql -u root -proot123 blog < backend/src/main/resources/schema.sql
```

或直接在 MySQL 中执行 `schema.sql` 的内容。

## 验证安装

```bash
mysql -u root -proot123 -e "SHOW DATABASES;"
mysql -u root -proot123 -e "USE blog; SHOW TABLES;"
```

## 后端配置

`application.yml` 中的配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: root123
```

## 启动后端

```bash
cd backend
./mvnw spring-boot:run
```

## 默认账号

- 用户名：admin
- 密码：admin123
