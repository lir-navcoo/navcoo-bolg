package com.blog.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置 /uploads 路径映射到实际文件目录
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///Users/lirui/Documents/project/blog/uploads/");
    }
}
