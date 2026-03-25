package com.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class ArticleRequest {
    private String id;
    
    @NotBlank(message = "标题不能为空")
    private String title;
    
    private String summary;
    
    @NotBlank(message = "内容不能为空")
    private String content;
    
    private String coverImage;
    
    private String category;
    
    private List<String> tags;
    
    private Boolean published;
}
