package com.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.dto.CategoryRequest;
import com.blog.entity.Category;
import com.blog.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryMapper categoryMapper;
    
    public List<Category> getAllCategories() {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(Category::getCreatedAt);
        return categoryMapper.selectList(wrapper);
    }
    
    public List<Category> getCategoriesSorted() {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Category::getSortOrder);
        return categoryMapper.selectList(wrapper);
    }
    
    public Category getCategoryById(Long id) {
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new RuntimeException("分类不存在: " + id);
        }
        return category;
    }
    
    public Category getCategoryBySlug(String slug) {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getSlug, slug);
        Category category = categoryMapper.selectOne(wrapper);
        if (category == null) {
            throw new RuntimeException("分类不存在: " + slug);
        }
        return category;
    }
    
    @Transactional
    public Category createCategory(CategoryRequest request) {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getName, request.getName());
        if (categoryMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("分类名称已存在");
        }
        
        if (request.getSlug() != null) {
            wrapper.eq(Category::getSlug, request.getSlug());
            if (categoryMapper.selectCount(wrapper) > 0) {
                throw new RuntimeException("分类别名已存在");
            }
        }
        
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(request.getSlug() != null ? request.getSlug() : generateSlug(request.getName()));
        category.setDescription(request.getDescription());
        category.setColor(request.getColor() != null ? request.getColor() : "bg-blue-500");
        category.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);
        category.setArticleCount(0);
        
        categoryMapper.insert(category);
        return category;
    }
    
    @Transactional
    public Category updateCategory(CategoryRequest request) {
        Category category = getCategoryById(request.getId());
        
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getName, request.getName()).ne(Category::getId, request.getId());
        if (categoryMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("分类名称已存在");
        }
        
        String slug = request.getSlug() != null ? request.getSlug() : generateSlug(request.getName());
        wrapper.eq(Category::getSlug, slug).ne(Category::getId, request.getId());
        if (categoryMapper.selectCount(wrapper) > 0) {
            throw new RuntimeException("分类别名已存在");
        }
        
        category.setName(request.getName());
        category.setSlug(slug);
        category.setDescription(request.getDescription());
        category.setColor(request.getColor() != null ? request.getColor() : category.getColor());
        category.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : category.getSortOrder());
        
        categoryMapper.updateById(category);
        return category;
    }
    
    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryMapper.deleteById(id);
    }
    
    @Transactional
    public void incrementArticleCount(Long categoryId) {
        Category category = getCategoryById(categoryId);
        category.setArticleCount(category.getArticleCount() + 1);
        categoryMapper.updateById(category);
    }
    
    @Transactional
    public void decrementArticleCount(Long categoryId) {
        Category category = getCategoryById(categoryId);
        if (category.getArticleCount() > 0) {
            category.setArticleCount(category.getArticleCount() - 1);
            categoryMapper.updateById(category);
        }
    }
    
    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\u4e00-\\u9fa5]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
