package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.dto.ArticleRequest;
import com.blog.entity.Article;
import com.blog.entity.User;
import com.blog.mapper.ArticleMapper;
import com.blog.mapper.CategoryMapper;
import com.blog.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleService {
    
    private final ArticleMapper articleMapper;
    private final CategoryMapper categoryMapper;
    private final UserMapper userMapper;
    
    // 获取已发布文章列表（公开）
    public Page<Article> getPublishedArticles(int page, int size) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getPublished, true)
               .orderByDesc(Article::getPublishedAt);
        Page<Article> result = articleMapper.selectPage(new Page<>(page + 1, size), wrapper);
        // MyBatis-Plus 分页从1开始，前端从0开始
        result.setCurrent(page + 1);
        // 填充 categorySlug
        fillCategorySlugs(result.getRecords());
        return result;
    }
    
    // 获取热门文章（公开）
    public List<Article> getHotArticles(int limit) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getPublished, true)
               .orderByDesc(Article::getViewCount)
               .last("LIMIT " + limit);
        List<Article> articles = articleMapper.selectList(wrapper);
        fillCategorySlugs(articles);
        return articles;
    }
    
    // 获取文章详情（公开，浏览量+1）
    @Transactional
    public Article getArticleDetail(String id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new RuntimeException("文章不存在");
        }
        
        if (!article.getPublished()) {
            throw new RuntimeException("文章未发布");
        }
        
        article.setViewCount(article.getViewCount() + 1);
        articleMapper.updateById(article);
        return article;
    }
    
    // 搜索文章（公开）
    public Page<Article> searchArticles(String keyword, int page, int size) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getPublished, true)
               .and(w -> w.like(Article::getTitle, keyword)
                       .or().like(Article::getSummary, keyword)
                       .or().like(Article::getContent, keyword))
               .orderByDesc(Article::getPublishedAt);
        Page<Article> result = articleMapper.selectPage(new Page<>(page + 1, size), wrapper);
        result.setCurrent(page + 1);
        return result;
    }
    
    // 按分类获取文章（公开）- 通过 slug
    public Page<Article> getArticlesBySlug(String slug, int page, int size) {
        // 通过 slug 查找分类名称
        LambdaQueryWrapper<com.blog.entity.Category> catWrapper = new LambdaQueryWrapper<>();
        catWrapper.eq(com.blog.entity.Category::getSlug, slug);
        com.blog.entity.Category category = categoryMapper.selectOne(catWrapper);
        
        String categoryName = category != null ? category.getName() : slug;
        
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getPublished, true)
               .eq(Article::getCategory, categoryName)
               .orderByDesc(Article::getPublishedAt);
        Page<Article> result = articleMapper.selectPage(new Page<>(page + 1, size), wrapper);
        result.setCurrent(page + 1);
        fillCategorySlugs(result.getRecords());
        return result;
    }
    
    // 按分类名称获取文章（兼容旧接口）
    public Page<Article> getArticlesByCategory(String category, int page, int size) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getPublished, true)
               .eq(Article::getCategory, category)
               .orderByDesc(Article::getPublishedAt);
        Page<Article> result = articleMapper.selectPage(new Page<>(page + 1, size), wrapper);
        result.setCurrent(page + 1);
        fillCategorySlugs(result.getRecords());
        return result;
    }
    
    // ============ 后台管理接口 ============
    
    // 创建文章（需登录）
    @Transactional
    public Article createArticle(ArticleRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
        userWrapper.eq(User::getUsername, username);
        User author = userMapper.selectOne(userWrapper);
        if (author == null) {
            throw new RuntimeException("用户不存在");
        }
        
        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setSummary(request.getSummary());
        article.setContent(request.getContent());
        article.setCoverImage(request.getCoverImage());
        article.setCategory(request.getCategory());
        article.setTags(request.getTags() != null ? String.join(",", request.getTags()) : "");
        article.setPublished(request.getPublished() != null ? request.getPublished() : false);
        article.setAuthorId(author.getId());
        article.setViewCount(0);
        article.setLikeCount(0);
        
        if (Boolean.TRUE.equals(article.getPublished())) {
            article.setPublishedAt(LocalDateTime.now());
        }
        
        articleMapper.insert(article);
        return article;
    }
    
    // 更新文章（需登录）
    @Transactional
    public Article updateArticle(ArticleRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Article article = articleMapper.selectById(request.getId());
        if (article == null) {
            throw new RuntimeException("文章不存在");
        }
        
        // 验证是否是作者
        User author = userMapper.selectById(article.getAuthorId());
        if (!author.getUsername().equals(username)) {
            throw new RuntimeException("无权限修改此文章");
        }
        
        article.setTitle(request.getTitle());
        article.setSummary(request.getSummary());
        article.setContent(request.getContent());
        article.setCoverImage(request.getCoverImage());
        article.setCategory(request.getCategory());
        article.setTags(request.getTags() != null ? String.join(",", request.getTags()) : "");
        
        // 如果从草稿变为发布状态
        if (request.getPublished() != null && request.getPublished() && article.getPublishedAt() == null) {
            article.setPublishedAt(LocalDateTime.now());
        }
        
        article.setPublished(request.getPublished() != null ? request.getPublished() : article.getPublished());
        
        articleMapper.updateById(article);
        return article;
    }
    
    // 删除文章（需登录）
    @Transactional
    public void deleteArticle(String id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new RuntimeException("文章不存在");
        }
        
        User author = userMapper.selectById(article.getAuthorId());
        if (!author.getUsername().equals(username)) {
            throw new RuntimeException("无权限删除此文章");
        }
        
        articleMapper.deleteById(id);
    }
    
    // 获取当前用户的所有文章（后台）
    public Page<Article> getMyArticles(int page, int size) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
        userWrapper.eq(User::getUsername, username);
        User author = userMapper.selectOne(userWrapper);
        if (author == null) {
            throw new RuntimeException("用户不存在");
        }
        
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getAuthorId, author.getId())
               .orderByDesc(Article::getUpdatedAt);
        Page<Article> result = articleMapper.selectPage(new Page<>(page + 1, size), wrapper);
        result.setCurrent(page + 1);
        return result;
    }
    
    // 获取统计数据
    public Map<String, Object> getStatistics() {
        long totalArticles = articleMapper.selectCount(null);
        
        LambdaQueryWrapper<Article> publishedWrapper = new LambdaQueryWrapper<>();
        publishedWrapper.eq(Article::getPublished, true);
        long publishedArticles = articleMapper.selectCount(publishedWrapper);
        
        // 统计分类
        LambdaQueryWrapper<Article> categoryWrapper = new LambdaQueryWrapper<>();
        categoryWrapper.eq(Article::getPublished, true)
                       .select(Article::getCategory);
        List<Article> articles = articleMapper.selectList(categoryWrapper);
        Map<String, Long> categoryCount = articles.stream()
                .filter(a -> a.getCategory() != null && !a.getCategory().isEmpty())
                .collect(Collectors.groupingBy(Article::getCategory, Collectors.counting()));
        
        List<Map<String, Object>> categoryStats = categoryCount.entrySet().stream()
                .map(e -> Map.<String, Object>of("category", e.getKey(), "count", e.getValue()))
                .collect(Collectors.toList());
        
        return Map.of(
                "totalArticles", totalArticles,
                "publishedArticles", publishedArticles,
                "draftArticles", totalArticles - publishedArticles,
                "categoryStats", categoryStats
        );
    }
    
    // 获取文章详情（管理员用，不检查发布状态）
    public Article getArticleById(String id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new RuntimeException("文章不存在");
        }
        return article;
    }
    
    // 填充文章的 categorySlug
    private void fillCategorySlugs(List<Article> articles) {
        if (articles == null || articles.isEmpty()) return;
        
        // 获取所有不重复的分类名称
        List<String> categoryNames = articles.stream()
                .map(Article::getCategory)
                .filter(c -> c != null && !c.isEmpty())
                .distinct()
                .collect(Collectors.toList());
        
        if (categoryNames.isEmpty()) return;
        
        // 批量查询分类获取 slug 映射
        LambdaQueryWrapper<com.blog.entity.Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(com.blog.entity.Category::getName, categoryNames);
        List<com.blog.entity.Category> categories = categoryMapper.selectList(wrapper);
        
        // 建立 name -> slug 映射
        Map<String, String> nameToSlug = categories.stream()
                .collect(Collectors.toMap(com.blog.entity.Category::getName, com.blog.entity.Category::getSlug));
        
        // 填充到文章
        for (Article article : articles) {
            if (article.getCategory() != null) {
                article.setCategorySlug(nameToSlug.getOrDefault(article.getCategory(), article.getCategory()));
            }
        }
    }
    
    // 获取所有分类
    public List<String> getAllCategories() {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Article::getPublished, true)
               .select(Article::getCategory)
               .isNotNull(Article::getCategory)
               .ne(Article::getCategory, "");
        List<Article> articles = articleMapper.selectList(wrapper);
        return articles.stream()
                .map(Article::getCategory)
                .distinct()
                .collect(Collectors.toList());
    }
}
