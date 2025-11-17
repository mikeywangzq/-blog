package com.blog.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 更新个人资料请求DTO
 */
@Data
public class UpdateProfileRequest {

    @Size(max = 100, message = "昵称长度不能超过100个字符")
    private String nickname;

    @Email(message = "邮箱格式不正确")
    @Size(max = 100, message = "邮箱长度不能超过100个字符")
    private String email;

    @Size(max = 500, message = "个人简介长度不能超过500个字符")
    private String bio;

    @Size(max = 500, message = "头像URL长度不能超过500个字符")
    private String avatar;
}
