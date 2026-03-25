package com.blog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.dto.ApiResponse;
import com.blog.dto.ArticleRequest;
import com.blog.entity.Article;
import com.blog.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ArticleController {
    
    private final ArticleService articleService;
    
    // ============ 公开接口 ============
    
    // 获取文章列表
    @GetMapping("/articles")
    public ResponseEntity<ApiResponse<Page<Article>>> getArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Article> articles = articleService.getPublishedArticles(page, size);
        return ResponseEntity.ok(ApiResponse.success(articles));
    }
    
    // 获取热门文章
    @GetMapping("/articles/hot")
    public ResponseEntity<ApiResponse<List<Article>>> getHotArticles(
            @RequestParam(defaultValue = "5") int limit
    ) {
        List<Article> articles = articleService.getHotArticles(limit);
        return ResponseEntity.ok(ApiResponse.success(articles));
    }
    
    // 获取文章详情
    @GetMapping("/articles/{id}")
    public ResponseEntity<ApiResponse<Article>> getArticleDetail(@PathVariable String id) {
        try {
            Article article = articleService.getArticleDetail(id);
            return ResponseEntity.ok(ApiResponse.success(article));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 搜索文章
    @GetMapping("/articles/search")
    public ResponseEntity<ApiResponse<Page<Article>>> searchArticles(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Article> articles = articleService.searchArticles(keyword, page, size);
        return ResponseEntity.ok(ApiResponse.success(articles));
    }
    
    // 按分类获取文章（公开）- 使用 slug 路由
    @GetMapping("/articles/category/{slug}")
    public ResponseEntity<ApiResponse<Page<Article>>> getArticlesByCategory(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Article> articles = articleService.getArticlesBySlug(slug, page, size);
        return ResponseEntity.ok(ApiResponse.success(articles));
    }
    
    // 获取所有分类
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        List<String> categories = articleService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }
    
    // ============ 后台管理接口 ============
    
    // 创建文章
    @PostMapping("/admin/articles")
    public ResponseEntity<ApiResponse<Article>> createArticle(@Valid @RequestBody ArticleRequest request) {
        try {
            Article article = articleService.createArticle(request);
            return ResponseEntity.ok(ApiResponse.success("文章创建成功", article));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 更新文章
    @PutMapping("/admin/articles/{id}")
    public ResponseEntity<ApiResponse<Article>> updateArticle(
            @PathVariable String id,
            @Valid @RequestBody ArticleRequest request
    ) {
        try {
            request.setId(id);
            Article article = articleService.updateArticle(request);
            return ResponseEntity.ok(ApiResponse.success("文章更新成功", article));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 删除文章
    @DeleteMapping("/admin/articles/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteArticle(@PathVariable String id) {
        try {
            articleService.deleteArticle(id);
            return ResponseEntity.ok(ApiResponse.success("文章删除成功", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 获取我的文章列表
    @GetMapping("/admin/articles")
    public ResponseEntity<ApiResponse<Page<Article>>> getMyArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Article> articles = articleService.getMyArticles(page, size);
        return ResponseEntity.ok(ApiResponse.success(articles));
    }
    
    // 获取文章详情（管理员用，不检查发布状态）
    @GetMapping("/admin/articles/{id}")
    public ResponseEntity<ApiResponse<Article>> getArticleById(@PathVariable String id) {
        try {
            Article article = articleService.getArticleById(id);
            return ResponseEntity.ok(ApiResponse.success(article));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 获取统计数据
    @GetMapping("/admin/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatistics() {
        Map<String, Object> stats = articleService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
