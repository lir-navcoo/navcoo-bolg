package com.blog.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.dto.ApiResponse;
import com.blog.entity.User;
import com.blog.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    // 获取当前用户信息
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("用户未登录"));
        }
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, userDetails.getUsername());
        User user = userMapper.selectOne(wrapper);
        if (user != null) {
            user.setPassword(null); // 不返回密码
            return ResponseEntity.ok(ApiResponse.success(user));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("用户不存在"));
    }
    
    // 更新当前用户信息
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<User>> updateCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserUpdateRequest request) {
        if (userDetails == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("用户未登录"));
        }
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, userDetails.getUsername());
        User user = userMapper.selectOne(wrapper);
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("用户不存在"));
        }
        
        // 更新昵称
        if (request.getNickname() != null && !request.getNickname().isEmpty()) {
            user.setNickname(request.getNickname());
        }
        
        // 更新头像
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        
        // 更新简介
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        
        userMapper.updateById(user);
        user.setPassword(null); // 不返回密码
        
        return ResponseEntity.ok(ApiResponse.success("更新成功", user));
    }
    
    // 修改密码
    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordRequest request) {
        if (userDetails == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("用户未登录"));
        }
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, userDetails.getUsername());
        User user = userMapper.selectOne(wrapper);
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("用户不存在"));
        }
        
        // 验证当前密码
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("当前密码错误"));
        }
        
        // 更新密码
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userMapper.updateById(user);
        
        return ResponseEntity.ok(ApiResponse.success("密码修改成功", null));
    }
    
    // 响应请求类
    @lombok.Data
    public static class UserUpdateRequest {
        private String nickname;
        private String avatar;
        private String bio;
    }
    
    @lombok.Data
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }
}
