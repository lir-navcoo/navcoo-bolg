package com.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
    
    private Long id;
    
    private String name;
    
    private String slug;
    
    private String description;
    
    private String color;
    
    private Integer sortOrder;
}
