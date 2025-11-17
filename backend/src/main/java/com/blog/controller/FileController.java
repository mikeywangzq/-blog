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

/**
 * 文件上传控制器
 *
 * 功能说明：
 * - 处理图片文件上传请求
 * - 实施多层安全验证防止恶意文件上传
 * - 返回上传后的文件访问URL
 *
 * 安全机制（10步验证流程）：
 * 1. 文件空值检查
 * 2. 文件大小限制（默认5MB，可配置）
 * 3. 文件名有效性检查
 * 4. 文件扩展名白名单验证
 * 5. Content-Type（MIME类型）验证
 * 6. 目录安全检查
 * 7. 使用UUID生成随机文件名
 * 8. 路径遍历攻击防护
 * 9. 安全保存文件
 * 10. 返回可访问的URL
 */
@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@Tag(name = "文件管理", description = "文件上传相关接口")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileController {

    /** 文件存储目录路径（从application.yml读取） */
    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    /** 单个文件大小上限（字节），默认5MB = 5242880字节 */
    @Value("${file.max-size:5242880}")
    private long maxFileSize;

    /**
     * 允许的图片文件扩展名白名单
     * 只有这些扩展名的文件才允许上传
     */
    private static final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(Arrays.asList(
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"
    ));

    /**
     * 允许的MIME类型白名单
     * 防止通过修改文件扩展名绕过验证
     * 浏览器和Spring会根据文件内容自动识别Content-Type
     */
    private static final Set<String> ALLOWED_CONTENT_TYPES = new HashSet<>(Arrays.asList(
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"
    ));

    /**
     * 上传图片文件
     *
     * 请求示例：
     * POST /api/files/upload
     * Content-Type: multipart/form-data
     * Body: file=<binary data>
     *
     * 响应示例：
     * {
     *   "url": "/uploads/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
     *   "filename": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg"
     * }
     *
     * @param file 上传的文件（multipart/form-data格式）
     * @return 包含文件URL和文件名的响应
     * @throws BadRequestException 当文件验证失败时抛出（空文件、大小超限、类型不支持等）
     */
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
     *
     * 安全措施：
     * 1. 清理文件名中的路径分隔符，防止路径遍历攻击
     *    例如：防止 "../../../etc/passwd.jpg" 这样的恶意文件名
     * 2. 验证文件必须有扩展名
     * 3. 将扩展名转为小写统一处理
     * 4. 与白名单对比，只允许指定的图片格式
     *
     * @param filename 原始文件名
     * @return 小写的文件扩展名（包含点号，如 ".jpg"）
     * @throws BadRequestException 当文件名无效或扩展名不在白名单中时抛出
     */
    private String validateAndGetExtension(String filename) {
        // 移除路径分隔符，防止路径遍历攻击
        // 例如：将 "../../malicious.jpg" 转换为 "..malicious.jpg"
        filename = filename.replace("\\", "").replace("/", "");

        // 查找最后一个点的位置
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            throw new BadRequestException("文件必须有扩展名");
        }

        // 提取扩展名并转为小写（统一处理 .JPG 和 .jpg）
        String extension = filename.substring(lastDotIndex).toLowerCase();

        // 白名单验证：只允许预定义的图片格式
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("不支持的文件格式。仅支持: " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        return extension;
    }
}
