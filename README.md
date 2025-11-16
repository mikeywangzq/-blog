# 个人博客系统

一个基于 **Spring Boot + React** 的前后端分离个人博客网站。

## 技术栈

### 后端
- **Spring Boot 3.2.0** - Java 后端框架
- **Spring Security** - 安全认证框架
- **Spring Data JPA** - 数据持久化
- **JWT** - 用户认证令牌
- **MySQL / H2** - 数据库
- **Swagger UI** - API 文档
- **Maven** - 项目构建工具

### 前端
- **React 18** - 前端框架
- **React Router** - 路由管理
- **Axios** - HTTP 客户端
- **Vite** - 构建工具
- **CSS3** - 样式

## 功能特性

### 已实现功能
- ✅ 用户注册、登录、JWT 认证
- ✅ 文章的增删改查
- ✅ 文章分类管理
- ✅ 文章搜索功能
- ✅ 文章浏览量统计
- ✅ 热门文章推荐
- ✅ 最新文章展示
- ✅ 文章分页显示
- ✅ 响应式布局

### 待扩展功能
- ⏳ 文章评论功能
- ⏳ Markdown 编辑器
- ⏳ 图片上传
- ⏳ 文章标签云
- ⏳ 用户个人中心
- ⏳ 后台管理系统

## 项目结构

```
-blog/
├── backend/                    # 后端项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/blog/
│   │   │   │   ├── config/    # 配置类（安全、JWT等）
│   │   │   │   ├── controller/ # 控制器层
│   │   │   │   ├── dto/       # 数据传输对象
│   │   │   │   ├── model/     # 实体类
│   │   │   │   ├── repository/ # 数据访问层
│   │   │   │   ├── service/   # 业务逻辑层
│   │   │   │   └── BlogApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml  # 应用配置
│   │   │       └── schema.sql       # 数据库脚本
│   │   └── test/
│   └── pom.xml                # Maven 配置
│
└── frontend/                  # 前端项目
    ├── src/
    │   ├── components/        # React 组件
    │   ├── pages/            # 页面组件
    │   ├── services/         # API 服务
    │   ├── styles/           # 样式文件
    │   ├── utils/            # 工具函数
    │   ├── App.jsx           # 应用主组件
    │   └── main.jsx          # 入口文件
    ├── index.html
    ├── package.json          # NPM 配置
    └── vite.config.js        # Vite 配置
```

## 快速开始

### 环境要求
- JDK 17+
- Node.js 16+
- MySQL 8+ (可选，默认使用 H2 内存数据库)
- Maven 3.6+

### 后端启动

1. 进入后端目录：
```bash
cd backend
```

2. 修改配置（可选）：
编辑 `src/main/resources/application.yml`，配置数据库连接信息。

3. 编译并启动：
```bash
# 使用 Maven 编译
mvn clean install

# 启动应用
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动。

### 前端启动

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

前端应用将在 `http://localhost:3000` 启动。

## API 文档

启动后端服务后，访问 Swagger UI 查看完整的 API 文档：
```
http://localhost:8080/api/swagger-ui.html
```

### 主要 API 端点

#### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

#### 文章接口
- `GET /api/posts` - 获取文章列表（分页）
- `GET /api/posts/{id}` - 获取文章详情
- `POST /api/posts` - 创建文章（需要认证）
- `PUT /api/posts/{id}` - 更新文章（需要认证）
- `DELETE /api/posts/{id}` - 删除文章（需要认证）
- `GET /api/posts/search` - 搜索文章
- `GET /api/posts/popular` - 获取热门文章
- `GET /api/posts/recent` - 获取最新文章

#### 分类接口
- `GET /api/categories` - 获取所有分类
- `POST /api/categories` - 创建分类（需要认证）
- `PUT /api/categories/{id}` - 更新分类（需要认证）
- `DELETE /api/categories/{id}` - 删除分类（需要认证）

## 数据库配置

### 开发环境（H2 内存数据库）
默认配置使用 H2 内存数据库，无需额外配置。访问 H2 控制台：
```
http://localhost:8080/api/h2-console
```
- JDBC URL: `jdbc:h2:mem:blogdb`
- Username: `sa`
- Password: (留空)

### 生产环境（MySQL）
1. 创建数据库：
```sql
CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 执行初始化脚本（可选）：
```bash
mysql -u root -p blog < backend/src/main/resources/schema.sql
```

3. 修改 `application.yml`：
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

## 部署指南

### 后端部署

1. 打包应用：
```bash
cd backend
mvn clean package -DskipTests
```

2. 运行 JAR 文件：
```bash
java -jar target/personal-blog-1.0.0.jar
```

### 前端部署

1. 构建生产版本：
```bash
cd frontend
npm run build
```

2. 将 `dist` 目录部署到 Nginx 或其他静态服务器。

Nginx 配置示例：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 开发说明

### 添加新功能
1. 后端：在对应的 `controller`、`service`、`repository` 中添加代码
2. 前端：在 `pages` 或 `components` 中创建新组件
3. API 调用：在 `services` 目录中添加 API 方法

### 代码规范
- 后端遵循 Java 标准命名规范
- 前端使用 ESLint 进行代码检查
- 提交前确保代码通过编译和测试

## 常见问题

### 1. 跨域问题
后端已配置 CORS，允许 `http://localhost:3000` 和 `http://localhost:5173` 访问。如需修改，编辑 `SecurityConfig.java`。

### 2. JWT Token 过期
默认 Token 有效期为 24 小时，可在 `application.yml` 中修改 `jwt.expiration`。

### 3. 文件上传大小限制
在 `application.yml` 中添加：
```yaml
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
```

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件

---

**Happy Coding! 🚀**
