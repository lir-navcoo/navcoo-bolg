package com.blog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.dto.ApiResponse;
import com.blog.entity.Article;
import com.blog.entity.User;
import com.blog.mapper.UserMapper;
import com.blog.security.JwtTokenProvider;
import com.blog.service.FavoriteService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserMapper userMapper;

    /**
     * 检查是否已收藏（公开接口）
     */
    @GetMapping("/articles/{articleId}/favorite")
    public ApiResponse<Boolean> checkFavorite(
            @PathVariable String articleId,
            HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) {
            return ApiResponse.success(false);
        }
        try {
            String username = jwtTokenProvider.extractUsername(token);
            User user = userMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<User>()
                    .eq("username", username)
            );
            if (user == null) {
                return ApiResponse.success(false);
            }
            boolean favorited = favoriteService.isFavorited(user.getId(), articleId);
            return ApiResponse.success(favorited);
        } catch (Exception e) {
            return ApiResponse.success(false);
        }
    }

    /**
     * 添加收藏（需要登录）
     */
    @PostMapping("/favorites/{articleId}")
    public ApiResponse<Boolean> addFavorite(
            @PathVariable String articleId,
            HttpServletRequest request) {
        Long userId = getUserId(request);
        if (userId == null) {
            return ApiResponse.error("请先登录");
        }
        boolean success = favoriteService.addFavorite(userId, articleId);
        return ApiResponse.success(success);
    }

    /**
     * 取消收藏（需要登录）
     */
    @DeleteMapping("/favorites/{articleId}")
    public ApiResponse<Boolean> removeFavorite(
            @PathVariable String articleId,
            HttpServletRequest request) {
        Long userId = getUserId(request);
        if (userId == null) {
            return ApiResponse.error("请先登录");
        }
        boolean success = favoriteService.removeFavorite(userId, articleId);
        return ApiResponse.success(success);
    }

    /**
     * 获取我的收藏列表（需要登录）
     */
    @GetMapping("/favorites")
    public ApiResponse<Page<Article>> getMyFavorites(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {
        Long userId = getUserId(request);
        if (userId == null) {
            return ApiResponse.error("请先登录");
        }
        Page<Article> favorites = favoriteService.getUserFavorites(userId, page, size);
        return ApiResponse.success(favorites);
    }

    /**
     * 获取收藏数量（需要登录）
     */
    @GetMapping("/favorites/count")
    public ApiResponse<Long> getFavoriteCount(HttpServletRequest request) {
        Long userId = getUserId(request);
        if (userId == null) {
            return ApiResponse.error("请先登录");
        }
        long count = favoriteService.getUserFavoriteCount(userId);
        return ApiResponse.success(count);
    }

    /**
     * 从请求中获取Token
     */
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * 从请求中获取用户ID
     */
    private Long getUserId(HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) {
            return null;
        }
        try {
            String username = jwtTokenProvider.extractUsername(token);
            User user = userMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<User>()
                    .eq("username", username)
            );
            return user != null ? user.getId() : null;
        } catch (Exception e) {
            return null;
        }
    }
}
