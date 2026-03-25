package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.blog.entity.Article;
import com.blog.entity.Favorite;
import com.blog.mapper.FavoriteMapper;
import com.blog.mapper.ArticleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService extends ServiceImpl<FavoriteMapper, Favorite> {

    @Autowired
    private ArticleMapper articleMapper;

    /**
     * 检查用户是否已收藏某文章
     */
    public boolean isFavorited(Long userId, String articleId) {
        QueryWrapper<Favorite> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.eq("article_id", articleId);
        return this.count(wrapper) > 0;
    }

    /**
     * 添加收藏
     */
    @Transactional
    public boolean addFavorite(Long userId, String articleId) {
        if (isFavorited(userId, articleId)) {
            return true; // 已收藏
        }
        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setArticleId(articleId);
        return this.save(favorite);
    }

    /**
     * 取消收藏
     */
    @Transactional
    public boolean removeFavorite(Long userId, String articleId) {
        QueryWrapper<Favorite> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.eq("article_id", articleId);
        return this.remove(wrapper);
    }

    /**
     * 获取用户的收藏列表
     */
    public Page<Article> getUserFavorites(Long userId, int page, int size) {
        // 获取收藏记录
        QueryWrapper<Favorite> favWrapper = new QueryWrapper<>();
        favWrapper.eq("user_id", userId);
        favWrapper.orderByDesc("created_at");
        favWrapper.select("article_id");
        
        Page<Favorite> favPage = new Page<>(page, size);
        Page<Favorite> result = this.page(favPage, favWrapper);
        
        // 获取收藏的文章
        Page<Article> articlePage = new Page<>(page, size);
        if (result.getRecords().isEmpty()) {
            return articlePage;
        }
        
        List<String> articleIds = result.getRecords().stream()
                .map(Favorite::getArticleId)
                .toList();
        
        QueryWrapper<Article> articleWrapper = new QueryWrapper<>();
        articleWrapper.in("id", articleIds);
        articleWrapper.eq("published", true);
        
        List<Article> articles = articleMapper.selectList(articleWrapper);
        
        articlePage.setRecords(articles);
        articlePage.setTotal(result.getTotal());
        
        return articlePage;
    }

    /**
     * 获取用户收藏数量
     */
    public long getUserFavoriteCount(Long userId) {
        QueryWrapper<Favorite> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        return this.count(wrapper);
    }
}
