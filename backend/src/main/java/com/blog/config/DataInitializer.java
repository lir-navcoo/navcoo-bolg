package com.blog.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.entity.Category;
import com.blog.entity.Tag;
import com.blog.entity.User;
import com.blog.mapper.CategoryMapper;
import com.blog.mapper.TagMapper;
import com.blog.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserMapper userMapper;
    private final TagMapper tagMapper;
    private final CategoryMapper categoryMapper;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // 创建默认管理员账号
        LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
        userWrapper.eq(User::getUsername, "admin");
        if (userMapper.selectCount(userWrapper) == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNickname("管理员");
            admin.setBio("博客系统管理员");
            userMapper.insert(admin);
            System.out.println("默认管理员账号已创建: admin / admin123");
        }
        
        // 初始化默认标签
        if (tagMapper.selectCount(null) == 0) {
            List<Tag> defaultTags = Arrays.asList(
                createTag("前端开发", "前端技术相关文章"),
                createTag("React", "React框架相关"),
                createTag("Vue", "Vue框架相关"),
                createTag("Node.js", "Node.js后端开发"),
                createTag("TypeScript", "TypeScript类型系统"),
                createTag("JavaScript", "JavaScript语言"),
                createTag("CSS", "样式与布局"),
                createTag("后端开发", "后端技术文章"),
                createTag("数据库", "数据库相关技术"),
                createTag("DevOps", "运维与部署"),
                createTag("架构设计", "系统架构设计"),
                createTag("性能优化", "性能调优技巧"),
                createTag("工具推荐", "开发工具推荐"),
                createTag("生活感悟", "生活随笔")
            );
            defaultTags.forEach(tagMapper::insert);
            System.out.println("默认标签已创建: " + defaultTags.size() + " 个");
        }
        
        // 初始化默认分类
        if (categoryMapper.selectCount(null) == 0) {
            List<Category> defaultCategories = Arrays.asList(
                createCategory("前端开发", "frontend", "前端技术相关文章", "bg-blue-500", 1),
                createCategory("后端技术", "backend", "后端开发相关", "bg-emerald-500", 2),
                createCategory("DevOps", "devops", "运维与部署", "bg-purple-500", 3),
                createCategory("架构设计", "architecture", "系统架构相关", "bg-amber-500", 4),
                createCategory("生活随笔", "life", "生活感悟与随笔", "bg-pink-500", 5),
                createCategory("技术杂谈", "tech", "技术相关的杂谈", "bg-cyan-500", 6)
            );
            defaultCategories.forEach(categoryMapper::insert);
            System.out.println("默认分类已创建: " + defaultCategories.size() + " 个");
        }
    }
    
    private Tag createTag(String name, String description) {
        Tag tag = new Tag();
        tag.setName(name);
        tag.setDescription(description);
        tag.setArticleCount(0);
        return tag;
    }
    
    private Category createCategory(String name, String slug, String description, String color, int sortOrder) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        category.setDescription(description);
        category.setColor(color);
        category.setSortOrder(sortOrder);
        category.setArticleCount(0);
        return category;
    }
}
