-- Blog Database Initialization Script for MySQL
-- Safe mode: Only creates tables and inserts data if they don't exist

USE blog;

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    avatar VARCHAR(255),
    bio VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create categories table if not exists
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    color VARCHAR(20) DEFAULT 'bg-blue-500',
    article_count INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create tags table if not exists
CREATE TABLE IF NOT EXISTS tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(100),
    article_count INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create articles table if not exists
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(32) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    content LONGTEXT,
    cover_image VARCHAR(500),
    category VARCHAR(50),
    tags VARCHAR(200),
    published BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    author_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at DATETIME,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_published (published),
    INDEX idx_category (category),
    INDEX idx_author (author_id),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create media table if not exists
CREATE TABLE IF NOT EXISTS media (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(100),
    size BIGINT DEFAULT 0,
    width INT,
    height INT,
    article_id VARCHAR(32),
    uploader_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_article (article_id),
    INDEX idx_uploader (uploader_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create favorites table if not exists
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    article_id VARCHAR(32) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_article (user_id, article_id),
    INDEX idx_user (user_id),
    INDEX idx_article (article_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin account (password: admin123) only if not exists
INSERT IGNORE INTO users (username, password, nickname, bio, created_at, updated_at) 
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '管理员', '博客管理员', NOW(), NOW());

-- Insert default categories only if not exists
INSERT IGNORE INTO categories (name, slug, description, color, sort_order, created_at, updated_at) VALUES
('技术', 'tech', '技术相关文章', 'bg-blue-500', 1, NOW(), NOW()),
('生活', 'life', '生活随笔', 'bg-green-500', 2, NOW(), NOW()),
('随笔', 'essay', '随笔感想', 'bg-yellow-500', 3, NOW(), NOW()),
('读书', 'reading', '读书笔记', 'bg-red-500', 4, NOW(), NOW()),
('旅行', 'travel', '旅行见闻', 'bg-purple-500', 5, NOW(), NOW()),
('其他', 'other', '其他分类', 'bg-gray-500', 6, NOW(), NOW());

-- Insert default tags only if not exists
INSERT IGNORE INTO tags (name, description, article_count, created_at, updated_at) VALUES
('Java', 'Java技术相关', 0, NOW(), NOW()),
('Spring Boot', 'Spring Boot框架', 0, NOW(), NOW()),
('React', 'React前端框架', 0, NOW(), NOW()),
('Vue', 'Vue前端框架', 0, NOW(), NOW()),
('Node.js', 'Node.js后端', 0, NOW(), NOW()),
('Python', 'Python技术', 0, NOW(), NOW()),
('数据库', '数据库相关', 0, NOW(), NOW()),
('Docker', '容器技术', 0, NOW(), NOW()),
('Kubernetes', 'K8s技术', 0, NOW(), NOW()),
('DevOps', 'DevOps实践', 0, NOW(), NOW()),
('云原生', '云原生技术', 0, NOW(), NOW()),
('微服务', '微服务架构', 0, NOW(), NOW()),
('人工智能', 'AI技术', 0, NOW(), NOW()),
('区块链', '区块链技术', 0, NOW(), NOW());

-- Insert sample article only if not exists
INSERT IGNORE INTO articles (id, title, summary, content, category, tags, published, view_count, author_id, created_at, updated_at, published_at)
VALUES (
    'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    '欢迎来到我的博客',
    '这是我的第一篇博客文章，介绍博客的功能和使用方法。',
    '<h1>欢迎来到我的博客</h1><p>这是一个使用 React + Spring Boot 构建的个人博客系统。</p><h2>主要功能</h2><ul><li>📝 文章发布与管理</li><li>🏷️ 标签与分类</li><li>📊 数据统计</li><li>🌈 响应式设计</li></ul><p>开始写作吧！</p>',
    'tech',
    'Spring Boot,React',
    TRUE,
    10,
    1,
    NOW(),
    NOW(),
    NOW()
);

-- Update category article count
UPDATE categories SET article_count = 1 WHERE slug = 'tech' AND (SELECT COUNT(*) FROM articles WHERE category = 'tech') > 0;
