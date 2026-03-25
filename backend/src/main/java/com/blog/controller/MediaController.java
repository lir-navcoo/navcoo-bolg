package com.blog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.entity.Media;
import com.blog.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/admin/media")
@RequiredArgsConstructor
public class MediaController {
    
    private final MediaService mediaService;
    
    // 存储路径
    private static final String UPLOAD_DIR = "/Users/lirui/Documents/project/blog/uploads";
    
    // 分页获取媒体列表
    @GetMapping
    public Map<String, Object> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String articleId,
            @RequestParam(required = false) String keyword
    ) {
        Page<Media> result = mediaService.getPage(page, size, articleId, keyword);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", result.getRecords());
        response.put("total", result.getTotal());
        response.put("page", result.getCurrent());
        response.put("pageSize", result.getSize());
        return response;
    }
    
    // 获取文章的所有媒体
    @GetMapping("/article/{articleId}")
    public Map<String, Object> getByArticle(@PathVariable String articleId) {
        List<Media> media = mediaService.getByArticleId(articleId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", media);
        return response;
    }
    
    // 获取公共媒体
    @GetMapping("/public")
    public Map<String, Object> getPublic() {
        List<Media> media = mediaService.getPublicMedia();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", media);
        return response;
    }
    
    // 上传文件
    @PostMapping("/upload")
    public Map<String, Object> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String articleId,
            HttpServletRequest request
    ) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 获取当前用户ID（从token中获取）
            String token = request.getHeader("Authorization");
            Long uploaderId = 1L; // 默认管理员
            
            // 创建上传目录
            String subDir = articleId != null && !articleId.isEmpty() ? articleId : "common";
            File uploadPath = new File(UPLOAD_DIR, subDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }
            
            // 生成文件名
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String newFilename = UUID.randomUUID().toString().replace("-", "") + extension;
            
            // 保存文件
            File destFile = new File(uploadPath, newFilename);
            file.transferTo(destFile);
            
            // 获取图片尺寸（如果是图片）
            Integer width = null;
            Integer height = null;
            String contentType = file.getContentType();
            if (contentType != null && contentType.startsWith("image/")) {
                try {
                    java.awt.image.BufferedImage img = javax.imageio.ImageIO.read(destFile);
                    if (img != null) {
                        width = img.getWidth();
                        height = img.getHeight();
                    }
                } catch (Exception e) {
                    // 忽略尺寸获取错误
                }
            }
            
            // 构建访问URL
            String url = "/uploads/" + subDir + "/" + newFilename;
            
            // 保存媒体记录
            Media media = new Media();
            media.setName(originalFilename);
            media.setUrl(url);
            media.setType(contentType);
            media.setSize(Long.valueOf(file.getSize()));
            media.setWidth(width);
            media.setHeight(height);
            media.setArticleId(articleId);
            media.setUploaderId(uploaderId);
            media.setCreatedAt(LocalDateTime.now());
            media.setUpdatedAt(LocalDateTime.now());
            
            mediaService.save(media);
            
            response.put("success", true);
            response.put("data", media);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "上传失败: " + e.getMessage());
        }
        
        return response;
    }
    
    // 批量上传
    @PostMapping("/upload/batch")
    public Map<String, Object> uploadBatch(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(required = false) String articleId,
            HttpServletRequest request
    ) {
        Map<String, Object> response = new HashMap<>();
        List<Media> uploaded = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        for (MultipartFile file : files) {
            try {
                String subDir = articleId != null && !articleId.isEmpty() ? articleId : "common";
                File uploadPath = new File(UPLOAD_DIR, subDir);
                if (!uploadPath.exists()) {
                    uploadPath.mkdirs();
                }
                
                String originalFilename = file.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String newFilename = UUID.randomUUID().toString().replace("-", "") + extension;
                
                File destFile = new File(uploadPath, newFilename);
                file.transferTo(destFile);
                
                Integer width = null;
                Integer height = null;
                String contentType = file.getContentType();
                if (contentType != null && contentType.startsWith("image/")) {
                    try {
                        java.awt.image.BufferedImage img = javax.imageio.ImageIO.read(destFile);
                        if (img != null) {
                            width = img.getWidth();
                            height = img.getHeight();
                        }
                    } catch (Exception e) {
                        // 忽略
                    }
                }
                
                String url = "/uploads/" + subDir + "/" + newFilename;
                
                Media media = new Media();
                media.setName(originalFilename);
                media.setUrl(url);
                media.setType(contentType);
                media.setSize(Long.valueOf(file.getSize()));
                media.setWidth(width);
                media.setHeight(height);
                media.setArticleId(articleId);
                media.setUploaderId(1L);
                media.setCreatedAt(LocalDateTime.now());
                media.setUpdatedAt(LocalDateTime.now());
                
                mediaService.save(media);
                uploaded.add(media);
                
            } catch (Exception e) {
                errors.add(file.getOriginalFilename() + ": " + e.getMessage());
            }
        }
        
        response.put("success", true);
        response.put("data", uploaded);
        response.put("errors", errors);
        return response;
    }
    
    // 删除媒体
    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        Media media = mediaService.getById(id);
        if (media == null) {
            response.put("success", false);
            response.put("message", "媒体不存在");
            return response;
        }
        
        // 删除物理文件
        String filePath = UPLOAD_DIR + media.getUrl().replace("/uploads", "");
        File file = new File(filePath);
        if (file.exists()) {
            file.delete();
        }
        
        // 删除数据库记录
        mediaService.delete(id);
        
        response.put("success", true);
        return response;
    }
    
    // 批量删除
    @DeleteMapping("/batch")
    public Map<String, Object> deleteBatch(@RequestBody List<Long> ids) {
        Map<String, Object> response = new HashMap<>();
        
        for (Long id : ids) {
            Media media = mediaService.getById(id);
            if (media != null) {
                String filePath = UPLOAD_DIR + media.getUrl().replace("/uploads", "");
                File file = new File(filePath);
                if (file.exists()) {
                    file.delete();
                }
            }
        }
        
        int count = mediaService.deleteBatch(ids);
        
        response.put("success", true);
        response.put("data", count);
        return response;
    }
}
