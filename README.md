<div align="center">

# 🚀 个人博客系统

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-18.2.0-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/Java-17+-orange.svg" alt="Java">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
</p>

<p align="center">
  <b>一个现代化的前后端分离个人博客系统</b>
</p>

<p align="center">
  基于 Spring Boot + React 构建，支持文章管理、分类、搜索等核心功能
</p>

</div>

---

## ✨ 特性

<table>
<tr>
<td>

**🔐 用户认证**
- JWT Token 认证
- 用户注册/登录
- 权限管理
- 个人中心

</td>
<td>

**📝 文章管理**
- 增删改查操作
- Markdown 编辑器
- 文章分类
- 标签系统（标签云）
- 草稿箱功能

</td>
</tr>
<tr>
<td>

**💬 互动功能**
- 文章评论系统
- 嵌套回复
- 点赞功能
- 收藏/书签功能
- 评论管理

</td>
<td>

**📊 数据统计**
- 浏览量统计
- 点赞数统计
- 收藏数统计
- 热门文章
- 最新文章

</td>
</tr>
<tr>
<td>

**🔍 搜索功能**
- 全文搜索
- 关键词匹配
- 分类筛选
- 标签筛选

</td>
<td>

**📤 文件管理**
- 图片上传
- 本地存储
- Markdown 图片
- 头像上传

</td>
</tr>
<tr>
<td>

**👤 用户中心**
- 个人资料编辑
- 头像管理
- 文章统计
- 快捷操作

</td>
<td>

**📑 阅读体验**
- 文章目录（TOC）
- 锚点跳转
- 滚动高亮
- 标签自动完成

</td>
</tr>
<tr>
<td>

**🎨 界面增强**
- 深色模式
- 主题切换
- 社交分享
- RSS订阅

</td>
<td>

**📚 内容管理**
- 文章归档
- 草稿自动保存
- 版本历史
- SEO优化

</td>
</tr>
</table>

## 🛠️ 技术栈

### 后端技术

| 技术 | 版本 | 说明 |
|------|------|------|
| Spring Boot | 3.2.0 | 核心框架 |
| Spring Security | 6.x | 安全框架 |
| Spring Data JPA | 3.x | 数据持久化 |
| MySQL / H2 | 8.x / 2.x | 数据库 |
| JWT | 0.12.3 | 身份认证 |
| Swagger | 2.3.0 | API 文档 |
| Rome | 2.1.0 | RSS生成 |
| Lombok | - | 简化代码 |

### 前端技术

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 18.2.0 | UI 框架 |
| React Router | 6.20.0 | 路由管理 |
| Axios | 1.6.2 | HTTP 客户端 |
| Vite | 5.0.8 | 构建工具 |
| date-fns | 3.0.0 | 日期处理 |

## 📂 项目结构

```
-blog/
├── 📁 backend/                      # 后端项目
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/com/blog/
│   │   │   │   ├── 📁 config/       # 🔧 配置类（安全、JWT等）
│   │   │   │   ├── 📁 controller/   # 🎮 REST API 控制器
│   │   │   │   ├── 📁 dto/          # 📦 数据传输对象
│   │   │   │   ├── 📁 model/        # 🗃️ JPA 实体类
│   │   │   │   ├── 📁 repository/   # 💾 数据访问层
│   │   │   │   ├── 📁 service/      # 🔨 业务逻辑层
│   │   │   │   └── 📄 BlogApplication.java
│   │   │   └── 📁 resources/
│   │   │       ├── 📄 application.yml
│   │   │       └── 📄 schema.sql
│   │   └── 📁 test/
│   └── 📄 pom.xml
│
└── 📁 frontend/                     # 前端项目
    ├── 📁 src/
    │   ├── 📁 components/           # 🧩 React 组件
    │   ├── 📁 pages/                # 📄 页面组件
    │   ├── 📁 services/             # 🌐 API 服务
    │   ├── 📁 styles/               # 🎨 样式文件
    │   ├── 📁 utils/                # 🔧 工具函数
    │   ├── 📄 App.jsx
    │   └── 📄 main.jsx
    ├── 📄 index.html
    ├── 📄 package.json
    └── 📄 vite.config.js
```

## 🚀 快速开始

### 📋 环境要求

确保您的开发环境满足以下要求：

- ☕ **JDK 17+**
- 📦 **Node.js 16+**
- 🐘 **MySQL 8+** (可选，默认使用 H2)
- 🔨 **Maven 3.6+**

### 🔧 后端启动

```bash
# 1️⃣ 进入后端目录
cd backend

# 2️⃣ 编译项目
mvn clean install

# 3️⃣ 启动应用
mvn spring-boot:run
```

✅ 后端服务将在 **http://localhost:8080** 启动

<details>
<summary>💡 使用 MySQL 数据库（可选）</summary>

```yaml
# 编辑 src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog
    username: your_username
    password: your_password
```

</details>

### 🎨 前端启动

```bash
# 1️⃣ 进入前端目录
cd frontend

# 2️⃣ 安装依赖
npm install

# 3️⃣ 启动开发服务器
npm run dev
```

✅ 前端应用将在 **http://localhost:3000** 启动

## 📖 API 文档

启动后端服务后，访问以下地址查看 API 文档：

🔗 **Swagger UI**: http://localhost:8080/api/swagger-ui.html

### 核心接口

#### 🔐 认证接口

```
POST   /api/auth/register      # 用户注册
POST   /api/auth/login         # 用户登录
```

#### 📝 文章接口

```
GET    /api/posts              # 获取文章列表（分页）
GET    /api/posts/{id}         # 获取文章详情
POST   /api/posts              # 创建文章 🔒
PUT    /api/posts/{id}         # 更新文章 🔒
DELETE /api/posts/{id}         # 删除文章 🔒
GET    /api/posts/search       # 搜索文章
GET    /api/posts/popular      # 热门文章
GET    /api/posts/recent       # 最新文章
GET    /api/posts/drafts       # 获取我的草稿 🔒
GET    /api/posts/my-posts     # 获取我的所有文章 🔒
```

#### 🏷️ 分类接口

```
GET    /api/categories         # 获取所有分类
GET    /api/categories/{id}    # 获取分类详情
POST   /api/categories         # 创建分类 🔒
PUT    /api/categories/{id}    # 更新分类 🔒
DELETE /api/categories/{id}    # 删除分类 🔒
```

#### 🔖 标签接口

```
GET    /api/tags               # 获取所有标签
GET    /api/tags/popular       # 获取热门标签（标签云）
GET    /api/tags/search        # 搜索标签（自动完成）
GET    /api/tags/{id}/posts    # 获取标签下的文章
```

#### 👤 用户接口

```
GET    /api/users/profile      # 获取当前用户资料 🔒
GET    /api/users/{username}   # 获取指定用户公开信息
PUT    /api/users/profile      # 更新个人资料 🔒
```

#### ⭐ 收藏接口

```
POST   /api/favorites/post/{id}        # 收藏文章 🔒
DELETE /api/favorites/post/{id}        # 取消收藏 🔒
GET    /api/favorites                  # 获取我的收藏列表 🔒
GET    /api/favorites/post/{id}/status # 检查收藏状态 🔒
GET    /api/favorites/post/{id}/count  # 获取文章收藏数
```

> 🔒 表示需要认证才能访问

## 💾 数据库配置

### 开发环境 - H2 内存数据库

默认配置，无需额外设置，开箱即用！

🔗 **H2 控制台**: http://localhost:8080/api/h2-console

```
JDBC URL: jdbc:h2:mem:blogdb
Username: sa
Password: (留空)
```

### 生产环境 - MySQL

<details>
<summary>📋 点击查看 MySQL 配置步骤</summary>

**1. 创建数据库**

```sql
CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**2. 执行初始化脚本**

```bash
mysql -u root -p blog < backend/src/main/resources/schema.sql
```

**3. 修改配置文件**

编辑 `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blog?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: your_username
    password: your_password
  jpa:
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
```

</details>

## 📦 部署指南

### 🖥️ 后端部署

```bash
# 打包应用
cd backend
mvn clean package -DskipTests

# 运行 JAR 文件
java -jar target/personal-blog-1.0.0.jar
```

### 🌐 前端部署

```bash
# 构建生产版本
cd frontend
npm run build

# dist 目录将包含所有静态文件
```

<details>
<summary>🔧 Nginx 配置示例</summary>

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

</details>

## 🎯 核心功能

### 用户功能
- ✅ 用户注册与登录
- ✅ JWT Token 认证
- ✅ 密码加密存储
- ✅ 权限控制
- ✅ **个人中心（个人资料、统计信息）**
- ✅ **个人资料编辑（昵称、邮箱、简介）**
- ✅ **头像上传**

### 文章管理
- ✅ 文章的增删改查
- ✅ Markdown 编辑器（编辑/预览模式）
- ✅ 文章分类
- ✅ **完整标签系统（多对多关联）**
- ✅ 文章摘要
- ✅ 封面图片
- ✅ **草稿箱功能（草稿/发布状态）**
- ✅ **标签自动完成建议**

### 互动功能
- ✅ 文章评论系统
- ✅ 嵌套回复支持
- ✅ 评论的增删查
- ✅ 文章点赞/取消点赞
- ✅ 点赞数统计
- ✅ 点赞状态查询
- ✅ **文章收藏/书签功能**
- ✅ **收藏状态同步**

### 高级功能
- ✅ 全文搜索
- ✅ 文章浏览量统计
- ✅ 热门文章推荐
- ✅ 最新文章展示
- ✅ 分页显示
- ✅ 响应式布局
- ✅ 图片上传功能
- ✅ **标签云展示（动态字体大小）**
- ✅ **标签文章筛选**
- ✅ **文章目录（TOC）自动生成**
- ✅ **目录锚点跳转**
- ✅ **阅读位置滚动高亮**

## 🔮 功能扩展计划

### 已完成 ✅
- ✅ 文章评论系统（支持嵌套回复）
- ✅ Markdown 编辑器（编辑/预览模式）
- ✅ 图片上传功能（本地存储）
- ✅ 文章点赞功能
- ✅ **标签云展示（热门标签、动态字体）**
- ✅ **用户个人中心（资料编辑、统计展示）**
- ✅ **文章收藏功能（收藏列表、状态同步）**
- ✅ **草稿箱系统（草稿管理、状态切换）**
- ✅ **文章目录TOC（自动生成、滚动高亮）**
- ✅ **标签自动完成（智能建议）**
- ✅ **头像上传（个人头像管理）**
- ✅ **🌙 深色模式支持（主题切换、本地存储）**
- ✅ **💾 文章草稿自动保存（30秒自动保存、可开关）**
- ✅ **📤 社交媒体分享（微博/Twitter/Facebook/LinkedIn/邮件）**
- ✅ **📅 文章归档功能（按月归档、归档页面）**
- ✅ **🔍 SEO优化（meta标签、Open Graph、结构化数据）**
- ✅ **📡 RSS订阅（RSS 2.0标准、全站和分类订阅）**
- ✅ **📚 文章版本历史（自动保存版本、版本对比、修改备注）**

### 待实现 ⏳
详细实现方案请查看 [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)

- ⏳ **后台管理系统** - 完整的管理后台（用户/文章/评论管理）
- ⏳ **Elasticsearch集成** - 全文检索优化，提升搜索体验
- ⏳ **邮件通知系统** - 评论/回复/关注通知

## 📸 界面预览

### 首页
- 文章列表展示
- **热门标签云（动态字体大小）**
- 热门文章推荐
- 最新文章侧边栏

### 文章详情
- 完整文章内容（Markdown渲染）
- **右侧文章目录（TOC）**
- **滚动高亮当前阅读位置**
- 作者信息
- 分类标签
- 浏览量统计
- **点赞和收藏按钮**

### 编辑器
- 文章创建/编辑
- 分类选择
- **标签自动完成建议**
- **草稿/发布状态切换**
- 图片上传

### 个人中心
- **个人资料展示和编辑**
- **头像上传**
- **统计数据（文章数、浏览量、收藏数）**
- **快捷操作（写文章、草稿箱、收藏）**

### 草稿箱
- **草稿文章列表**
- **编辑/删除操作**
- **最后更新时间显示**

### 我的收藏
- **收藏文章卡片展示**
- **取消收藏操作**
- **文章统计信息**

## ❓ 常见问题

<details>
<summary><b>跨域问题如何解决？</b></summary>

后端已配置 CORS，允许 `localhost:3000` 和 `localhost:5173` 访问。如需修改，编辑 `SecurityConfig.java` 中的 `corsConfigurationSource()` 方法。

</details>

<details>
<summary><b>JWT Token 过期时间？</b></summary>

默认有效期为 24 小时，可在 `application.yml` 中修改 `jwt.expiration` 配置（单位：毫秒）。

</details>

<details>
<summary><b>如何修改文件上传大小限制？</b></summary>

在 `application.yml` 中添加：

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
```

</details>

<details>
<summary><b>如何修改服务器端口？</b></summary>

编辑 `application.yml`：

```yaml
server:
  port: 8080  # 修改为您需要的端口
```

</details>

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. 🍴 Fork 本仓库
2. 🔀 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. ✅ 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 📤 推送到分支 (`git push origin feature/AmazingFeature`)
5. 🎉 提交 Pull Request

### 开发规范

- 后端代码遵循 Java 标准命名规范
- 前端代码使用 ESLint 进行检查
- 提交前确保所有测试通过
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📮 联系方式

如有问题或建议，欢迎联系：

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/blog/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/blog/discussions)

## 🌟 致谢

感谢所有为这个项目做出贡献的开发者！

---

<div align="center">

**如果这个项目对您有帮助，请给一个 ⭐ Star！**

Made with ❤️ by [Your Name]

</div>
