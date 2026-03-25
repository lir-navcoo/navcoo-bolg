package com.blog.controller;

import com.blog.dto.ApiResponse;
import com.blog.dto.TagRequest;
import com.blog.entity.Tag;
import com.blog.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tags")
@RequiredArgsConstructor
public class TagController {
    
    private final TagService tagService;
    
    // 获取所有标签
    @GetMapping
    public ResponseEntity<ApiResponse<List<Tag>>> getAllTags() {
        List<Tag> tags = tagService.getAllTags();
        return ResponseEntity.ok(ApiResponse.success(tags));
    }
    
    // 获取单个标签
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Tag>> getTagById(@PathVariable Long id) {
        try {
            Tag tag = tagService.getTagById(id);
            return ResponseEntity.ok(ApiResponse.success(tag));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 创建标签
    @PostMapping
    public ResponseEntity<ApiResponse<Tag>> createTag(@RequestBody TagRequest request) {
        try {
            Tag tag = tagService.createTag(request);
            return ResponseEntity.ok(ApiResponse.success("标签创建成功", tag));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 更新标签
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Tag>> updateTag(
            @PathVariable Long id,
            @RequestBody TagRequest request
    ) {
        try {
            request.setId(id);
            Tag tag = tagService.updateTag(request);
            return ResponseEntity.ok(ApiResponse.success("标签更新成功", tag));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // 删除标签
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTag(@PathVariable Long id) {
        try {
            tagService.deleteTag(id);
            return ResponseEntity.ok(ApiResponse.success("标签删除成功", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
