package com.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("articles")
public class Article {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    private String title;
    private String summary;
    private String content;
    private String coverImage;
    private String category;
    
    @TableField(exist = false) // 不存储在数据库，通过分类表动态查询
    private String categorySlug; // 分类别名，用于路由
    private String tags;
    private Boolean published = false;
    private Integer viewCount = 0;
    private Integer likeCount = 0;
    private Long authorId;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    private LocalDateTime publishedAt;
}
