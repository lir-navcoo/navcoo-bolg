package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.dto.TagRequest;
import com.blog.entity.Tag;
import com.blog.mapper.TagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    
    private final TagMapper tagMapper;
    
    public List<Tag> getAllTags() {
        LambdaQueryWrapper<Tag> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(Tag::getCreatedAt);
        return tagMapper.selectList(wrapper);
    }
    
    public Tag getTagById(Long id) {
        Tag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new RuntimeException("标签不存在: " + id);
        }
        return tag;
    }
    
    @Transactional
    public Tag createTag(TagRequest request) {
        LambdaQueryWrapper<Tag> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Tag::getName, request.getName());
        if (tagMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("标签名称已存在");
        }
        
        Tag tag = new Tag();
        tag.setName(request.getName());
        tag.setDescription(request.getDescription());
        tag.setArticleCount(0);
        
        tagMapper.insert(tag);
        return tag;
    }
    
    @Transactional
    public Tag updateTag(TagRequest request) {
        Tag tag = getTagById(request.getId());
        
        LambdaQueryWrapper<Tag> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Tag::getName, request.getName()).ne(Tag::getId, request.getId());
        if (tagMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("标签名称已存在");
        }
        
        tag.setName(request.getName());
        tag.setDescription(request.getDescription());
        
        tagMapper.updateById(tag);
        return tag;
    }
    
    @Transactional
    public void deleteTag(Long id) {
        Tag tag = getTagById(id);
        tagMapper.deleteById(id);
    }
    
    @Transactional
    public void incrementArticleCount(Long tagId) {
        Tag tag = getTagById(tagId);
        tag.setArticleCount(tag.getArticleCount() + 1);
        tagMapper.updateById(tag);
    }
    
    @Transactional
    public void decrementArticleCount(Long tagId) {
        Tag tag = getTagById(tagId);
        if (tag.getArticleCount() > 0) {
            tag.setArticleCount(tag.getArticleCount() - 1);
            tagMapper.updateById(tag);
        }
    }
}
