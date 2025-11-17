import { Helmet } from 'react-helmet-async';

/**
 * SEO头部组件
 * 管理页面的meta标签、Open Graph标签等
 */
const SEOHead = ({
  title = '个人博客',
  description = '一个现代化的个人博客系统',
  keywords = '博客,技术,编程',
  author = 'Your Name',
  image = '/default-og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  publishedTime,
  modifiedTime,
  tags = []
}) => {
  const fullTitle = title.includes('个人博客') ? title : `${title} - 个人博客`;

  return (
    <Helmet>
      {/* 基本meta标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="个人博客" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* 文章特定标签 */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* SEO优化 */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#007bff" />
    </Helmet>
  );
};

export default SEOHead;
