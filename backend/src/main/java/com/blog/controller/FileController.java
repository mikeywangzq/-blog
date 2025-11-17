package com.blog.controller;

import com.blog.exception.BadRequestException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@Tag(name = "文件管理", description = "文件上传相关接口")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileController {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    @Value("${file.max-size:5242880}") // 默认5MB
    private long maxFileSize;

    // 允许的图片格式
    private static final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(Arrays.asList(
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"
    ));

    // 允许的MIME类型
    private static final Set<String> ALLOWED_CONTENT_TYPES = new HashSet<>(Arrays.asList(
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"
    ));

    @PostMapping("/upload")
    @Operation(summary = "上传图片")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // 1. 检查文件是否为空
            if (file.isEmpty()) {
                throw new BadRequestException("文件不能为空");
            }

            // 2. 检查文件大小
            if (file.getSize() > maxFileSize) {
                throw new BadRequestException("文件大小不能超过 " + (maxFileSize / 1024 / 1024) + "MB");
            }

            // 3. 验证文件名
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                throw new BadRequestException("文件名无效");
            }

            // 4. 验证并清理文件扩展名
            String extension = validateAndGetExtension(originalFilename);

            // 5. 验证Content-Type
            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
                throw new BadRequestException("不支持的文件类型。仅支持图片文件");
            }

            // 6. 创建上传目录
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }

            // 7. 生成安全的唯一文件名
            String filename = UUID.randomUUID().toString() + extension;

            // 8. 验证文件路径，防止路径遍历攻击
            Path filePath = Paths.get(uploadDir, filename).normalize();
            if (!filePath.startsWith(Paths.get(uploadDir).normalize())) {
                throw new BadRequestException("非法的文件路径");
            }

            // 9. 保存文件
            Files.write(filePath, file.getBytes());

            // 10. 返回文件URL
            Map<String, String> response = new HashMap<>();
            response.put("url", "/uploads/" + filename);
            response.put("filename", filename);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            throw new BadRequestException("文件上传失败: " + e.getMessage());
        }
    }

    /**
     * 验证并获取文件扩展名
     */
    private String validateAndGetExtension(String filename) {
        // 移除路径分隔符，防止路径遍历
        filename = filename.replace("\\", "").replace("/", "");

        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            throw new BadRequestException("文件必须有扩展名");
        }

        String extension = filename.substring(lastDotIndex).toLowerCase();

        // 检查是否在允许的扩展名列表中
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("不支持的文件格式。仅支持: " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        return extension;
    }
}
