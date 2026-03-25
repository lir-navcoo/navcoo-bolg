package com.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
    
    @Select("SELECT * FROM articles ORDER BY created_at DESC")
    IPage<Article> findAllPaged(Page<Article> page);
    
    @Select("SELECT * FROM articles WHERE author_id = #{authorId} ORDER BY created_at DESC")
    IPage<Article> findByAuthorId(Page<Article> page, @Param("authorId") Long authorId);
    
    @Select("SELECT * FROM articles WHERE published = true ORDER BY created_at DESC")
    IPage<Article> findPublishedPaged(Page<Article> page);
    
    @Select("SELECT * FROM articles ORDER BY view_count DESC LIMIT #{limit}")
    List<Article> findHot(@Param("limit") int limit);
    
    @Select("SELECT COUNT(*) FROM articles WHERE author_id = #{authorId} AND published = true")
    int countPublishedByAuthor(@Param("authorId") Long authorId);
    
    @Select("SELECT COUNT(*) FROM articles WHERE author_id = #{authorId} AND published = false")
    int countDraftByAuthor(@Param("authorId") Long authorId);
    
    @Select("SELECT COUNT(*) FROM articles WHERE author_id = #{authorId}")
    int countAllByAuthor(@Param("authorId") Long authorId);
    
    @Select("SELECT category, COUNT(*) as count FROM articles WHERE published = true GROUP BY category")
    List<Article> findCategoryStats();
}
