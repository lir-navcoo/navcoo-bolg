package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.entity.Media;
import com.blog.mapper.MediaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MediaService {
    
    private final MediaMapper mediaMapper;
    
    // 分页查询，可按文章ID筛选
    public Page<Media> getPage(int page, int size, String articleId, String keyword) {
        Page<Media> p = new Page<>(page, size);
        QueryWrapper<Media> wrapper = new QueryWrapper<>();
        
        if (articleId != null && !articleId.isEmpty()) {
            wrapper.eq("article_id", articleId);
        }
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like("name", keyword);
        }
        
        wrapper.orderByDesc("created_at");
        return mediaMapper.selectPage(p, wrapper);
    }
    
    // 获取文章的所有媒体
    public List<Media> getByArticleId(String articleId) {
        return mediaMapper.selectList(
            new QueryWrapper<Media>()
                .eq("article_id", articleId)
                .orderByDesc("created_at")
        );
    }
    
    // 获取公共媒体
    public List<Media> getPublicMedia() {
        return mediaMapper.selectList(
            new QueryWrapper<Media>()
                .isNull("article_id")
                .orderByDesc("created_at")
        );
    }
    
    // 根据ID获取
    public Media getById(Long id) {
        return mediaMapper.selectById(id);
    }
    
    // 保存
    public Media save(Media media) {
        if (media.getId() == null) {
            mediaMapper.insert(media);
        } else {
            mediaMapper.updateById(media);
        }
        return media;
    }
    
    // 删除
    public boolean delete(Long id) {
        return mediaMapper.deleteById(id) > 0;
    }
    
    // 批量删除
    public int deleteBatch(List<Long> ids) {
        return mediaMapper.deleteBatchIds(ids);
    }
}
