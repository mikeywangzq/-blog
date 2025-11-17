/**
 * SEO工具函数
 * 动态更新页面meta标签
 */

/**
 * 更新页面标题
 */
export const updateTitle = (title) => {
  document.title = title.includes('个人博客') ? title : `${title} - 个人博客`;
};

/**
 * 更新meta标签
 */
export const updateMeta = (name, content) => {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

/**
 * 更新Open Graph标签
 */
export const updateOGMeta = (property, content) => {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

/**
 * 设置页面SEO信息
 */
export const setSEO = ({
  title = '个人博客',
  description = '一个现代化的个人博客系统',
  keywords = '博客,技术,编程',
  image = '/default-og-image.jpg',
  type = 'website',
  author = 'Your Name',
  tags = []
}) => {
  // 更新基本信息
  updateTitle(title);
  updateMeta('description', description);
  updateMeta('keywords', keywords);
  updateMeta('author', author);

  // 更新Open Graph
  const fullTitle = title.includes('个人博客') ? title : `${title} - 个人博客`;
  updateOGMeta('og:title', fullTitle);
  updateOGMeta('og:description', description);
  updateOGMeta('og:type', type);
  updateOGMeta('og:image', image);
  updateOGMeta('og:url', window.location.href);

  // 更新Twitter Card
  updateMeta('twitter:card', 'summary_large_image');
  updateMeta('twitter:title', fullTitle);
  updateMeta('twitter:description', description);
  updateMeta('twitter:image', image);

  // 添加结构化数据
  if (type === 'article' && tags.length > 0) {
    addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: image,
      author: {
        '@type': 'Person',
        name: author
      },
      keywords: tags.join(', ')
    });
  }
};

/**
 * 添加结构化数据（JSON-LD）
 */
export const addStructuredData = (data) => {
  // 移除旧的结构化数据
  const oldScript = document.querySelector('script[type="application/ld+json"]');
  if (oldScript) {
    oldScript.remove();
  }

  // 添加新的结构化数据
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * 生成网站地图URL（用于sitemap.xml）
 */
export const generateSitemapEntry = (loc, lastmod, changefreq = 'weekly', priority = '0.8') => {
  return {
    loc,
    lastmod,
    changefreq,
    priority
  };
};
