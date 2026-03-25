package com.blog.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("media")
public class Media {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;           // 文件名
    private String url;             // 文件URL
    private String type;            // MIME类型
    private Long size;              // 文件大小
    private Integer width;          // 图片宽度
    private Integer height;         // 图片高度
    private String articleId;       // 关联文章ID（null表示公共资源）
    private Long uploaderId;        // 上传者ID
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
