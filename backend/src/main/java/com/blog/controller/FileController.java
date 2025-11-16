package com.blog.controller;

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
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@Tag(name = "文件管理", description = "文件上传相关接口")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileController {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    @PostMapping("/upload")
    @Operation(summary = "上传图片")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // 创建上传目录
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }

            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String filename = UUID.randomUUID().toString() + extension;

            // 保存文件
            Path filePath = Paths.get(uploadDir, filename);
            Files.write(filePath, file.getBytes());

            // 返回文件URL
            Map<String, String> response = new HashMap<>();
            response.put("url", "/uploads/" + filename);
            response.put("filename", filename);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            throw new RuntimeException("文件上传失败: " + e.getMessage());
        }
    }
}
