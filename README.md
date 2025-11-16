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

</td>
<td>

**📝 文章管理**
- 增删改查操作
- Markdown 支持
- 文章分类

</td>
</tr>
<tr>
<td>

**🔍 搜索功能**
- 全文搜索
- 关键词高亮
- 分类筛选

</td>
<td>

**📊 数据统计**
- 浏览量统计
- 热门文章
- 最新文章

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
```

#### 🏷️ 分类接口

```
GET    /api/categories         # 获取所有分类
GET    /api/categories/{id}    # 获取分类详情
POST   /api/categories         # 创建分类 🔒
PUT    /api/categories/{id}    # 更新分类 🔒
DELETE /api/categories/{id}    # 删除分类 🔒
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

### 文章管理
- ✅ 文章的增删改查
- ✅ 文章分类
- ✅ 文章标签
- ✅ 文章摘要
- ✅ 封面图片
- ✅ 发布/草稿状态

### 高级功能
- ✅ 全文搜索
- ✅ 文章浏览量统计
- ✅ 热门文章推荐
- ✅ 最新文章展示
- ✅ 分页显示
- ✅ 响应式布局

## 🔮 未来规划

- ⏳ 文章评论系统
- ⏳ Markdown 编辑器
- ⏳ 图片上传功能
- ⏳ 文章标签云
- ⏳ 用户个人中心
- ⏳ 后台管理系统
- ⏳ 文章点赞收藏
- ⏳ RSS 订阅
- ⏳ 社交媒体分享
- ⏳ SEO 优化

## 📸 界面预览

### 首页
- 文章列表展示
- 热门文章推荐
- 最新文章侧边栏

### 文章详情
- 完整文章内容
- 作者信息
- 分类标签
- 浏览量统计

### 编辑器
- 文章创建/编辑
- 分类选择
- 标签管理
- 发布控制

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
