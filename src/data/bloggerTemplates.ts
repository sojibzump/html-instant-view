
export interface BloggerTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
}

export const bloggerTemplates: BloggerTemplate[] = [
  {
    id: 'basic-blog',
    name: 'Basic Blog Template',
    description: 'A simple responsive blog template for beginners',
    category: 'Basic',
    code: `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:version='2' class='v2' expr:dir='data:blog.languageDirection' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
  <meta content='IE=EmulateIE7' http-equiv='X-UA-Compatible'/>
  <b:if cond='data:blog.isMobile'>
    <meta content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0' name='viewport'/>
  <b:else/>
    <meta content='width=1100' name='viewport'/>
  </b:if>
  <b:include data='blog' name='all-head-content'/>
  <title><data:blog.pageTitle/></title>
  <b:skin><![CDATA[
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background: #f8f9fa;
      line-height: 1.6;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 { font-size: 2.5em; margin-bottom: 10px; }
    .main-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .post {
      background: white;
      margin-bottom: 30px;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .post-title {
      font-size: 28px;
      margin-bottom: 15px;
      color: #333;
    }
    .post-title a {
      color: inherit;
      text-decoration: none;
    }
    .post-title a:hover { color: #667eea; }
    .post-body { color: #555; font-size: 16px; }
    @media (max-width: 768px) {
      .header { padding: 20px; }
      .header h1 { font-size: 2em; }
      .post { padding: 20px; margin-bottom: 20px; }
    }
  ]]></b:skin>
</head>
<body>
  <div class='header'>
    <h1><data:blog.title/></h1>
    <p><data:blog.description/></p>
  </div>
  
  <div class='main-wrapper'>
    <b:section class='main' id='main' maxwidgets='1' showaddelement='no'>
      <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog' version='1'>
        <b:includable id='main'>
          <b:loop values='data:posts' var='post'>
            <div class='post'>
              <h2 class='post-title'>
                <a expr:href='data:post.url'><data:post.title/></a>
              </h2>
              <div class='post-body'>
                <data:post.body/>
              </div>
            </div>
          </b:loop>
        </b:includable>
      </b:widget>
    </b:section>
  </div>
</body>
</html>`
  },
  {
    id: 'modern-blog',
    name: 'Modern Blog Template',
    description: 'A modern responsive blog with sidebar and advanced styling',
    category: 'Modern',
    code: `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:version='2' class='v2' expr:dir='data:blog.languageDirection' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
  <meta content='IE=EmulateIE7' http-equiv='X-UA-Compatible'/>
  <b:if cond='data:blog.isMobile'>
    <meta content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0' name='viewport'/>
  <b:else/>
    <meta content='width=1100' name='viewport'/>
  </b:if>
  <b:include data='blog' name='all-head-content'/>
  <title><data:blog.pageTitle/></title>
  <b:skin><![CDATA[
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(20px);
      padding: 40px;
      border-radius: 20px;
      margin-bottom: 40px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .header h1 {
      font-size: 3em;
      background: linear-gradient(45deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    .main-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 40px;
    }
    .posts-section, .sidebar {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(20px);
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .sidebar { height: fit-content; }
    .post {
      margin-bottom: 50px;
      padding-bottom: 40px;
      border-bottom: 2px solid #f0f0f0;
    }
    .post:last-child { border-bottom: none; }
    .post-title {
      font-size: 32px;
      margin-bottom: 20px;
      font-weight: 700;
    }
    .post-title a {
      color: #333;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    .post-title a:hover {
      background: linear-gradient(45deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .post-meta {
      color: #888;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    .post-body {
      font-size: 18px;
      line-height: 1.8;
    }
    .sidebar h3 {
      color: #333;
      margin-bottom: 20px;
      font-size: 24px;
    }
    .sidebar ul {
      list-style: none;
      padding: 0;
    }
    .sidebar li {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    @media (max-width: 1024px) {
      .main-content { grid-template-columns: 1fr; }
      .container { padding: 15px; }
      .header { padding: 30px 20px; }
      .header h1 { font-size: 2.5em; }
      .posts-section, .sidebar { padding: 30px 20px; }
    }
    @media (max-width: 768px) {
      .header h1 { font-size: 2em; }
      .post-title { font-size: 24px; }
      .post-body { font-size: 16px; }
    }
  ]]></b:skin>
</head>
<body>
  <div class='container'>
    <header class='header'>
      <h1><data:blog.title/></h1>
      <p style='font-size: 18px; color: #666;'><data:blog.description/></p>
    </header>
    
    <div class='main-content'>
      <main class='posts-section'>
        <b:section class='main' id='main' maxwidgets='1' showaddelement='no'>
          <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog' version='1'>
            <b:includable id='main'>
              <b:loop values='data:posts' var='post'>
                <article class='post'>
                  <h2 class='post-title'>
                    <a expr:href='data:post.url'><data:post.title/></a>
                  </h2>
                  <div class='post-meta'>
                    Published on <data:post.dateHeader/>
                  </div>
                  <div class='post-body'>
                    <data:post.body/>
                  </div>
                </article>
              </b:loop>
            </b:includable>
          </b:widget>
        </b:section>
      </main>
      
      <aside class='sidebar'>
        <h3>About This Blog</h3>
        <p style='margin-bottom: 30px; color: #666;'>Welcome to our modern blog! Discover amazing content and insights.</p>
        
        <h3>Categories</h3>
        <ul>
          <li><a href='#' style='color: #667eea; text-decoration: none;'>Technology</a></li>
          <li><a href='#' style='color: #667eea; text-decoration: none;'>Lifestyle</a></li>
          <li><a href='#' style='color: #667eea; text-decoration: none;'>Travel</a></li>
          <li><a href='#' style='color: #667eea; text-decoration: none;'>Photography</a></li>
        </ul>
      </aside>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'magazine-style',
    name: 'Magazine Style Template',
    description: 'A professional magazine-style layout with featured posts',
    category: 'Professional',
    code: `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:version='2' class='v2' expr:dir='data:blog.languageDirection' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
  <meta content='IE=EmulateIE7' http-equiv='X-UA-Compatible'/>
  <b:if cond='data:blog.isMobile'>
    <meta content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0' name='viewport'/>
  <b:else/>
    <meta content='width=1100' name='viewport'/>
  </b:if>
  <b:include data='blog' name='all-head-content'/>
  <title><data:blog.pageTitle/></title>
  <b:skin><![CDATA[
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', serif;
      line-height: 1.7;
      color: #2c3e50;
      background: #ffffff;
    }
    .header {
      background: #2c3e50;
      color: white;
      padding: 60px 0;
      border-bottom: 5px solid #e74c3c;
    }
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      text-align: center;
    }
    .header h1 {
      font-size: 4em;
      font-weight: 300;
      letter-spacing: 2px;
      margin-bottom: 15px;
    }
    .header p {
      font-size: 1.2em;
      opacity: 0.9;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .featured-post {
      background: #f8f9fa;
      padding: 50px;
      margin-bottom: 50px;
      border-left: 5px solid #e74c3c;
    }
    .featured-post h2 {
      font-size: 2.5em;
      margin-bottom: 20px;
      color: #2c3e50;
    }
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 40px;
      margin-top: 40px;
    }
    .post {
      background: white;
      border: 1px solid #ecf0f1;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .post:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .post-content {
      padding: 30px;
    }
    .post-title {
      font-size: 1.8em;
      margin-bottom: 15px;
      line-height: 1.3;
    }
    .post-title a {
      color: #2c3e50;
      text-decoration: none;
      transition: color 0.3s ease;
    }
    .post-title a:hover {
      color: #e74c3c;
    }
    .post-excerpt {
      color: #7f8c8d;
      font-size: 1.1em;
      margin-bottom: 20px;
    }
    .post-meta {
      color: #95a5a6;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    @media (max-width: 768px) {
      .header h1 { font-size: 2.5em; }
      .featured-post { padding: 30px 20px; }
      .posts-grid { grid-template-columns: 1fr; gap: 20px; }
      .post-content { padding: 20px; }
    }
  ]]></b:skin>
</head>
<body>
  <header class='header'>
    <div class='header-content'>
      <h1><data:blog.title/></h1>
      <p><data:blog.description/></p>
    </div>
  </header>
  
  <div class='container'>
    <b:section class='main' id='main' maxwidgets='1' showaddelement='no'>
      <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog' version='1'>
        <b:includable id='main'>
          <b:loop values='data:posts' var='post'>
            <b:if cond='data:post.isFirstPost'>
              <div class='featured-post'>
                <h2><a expr:href='data:post.url'><data:post.title/></a></h2>
                <div class='post-excerpt'>
                  <data:post.snippet/>
                </div>
                <div class='post-meta'>
                  Featured • <data:post.dateHeader/>
                </div>
              </div>
              <div class='posts-grid'>
            <b:else/>
              <article class='post'>
                <div class='post-content'>
                  <h3 class='post-title'>
                    <a expr:href='data:post.url'><data:post.title/></a>
                  </h3>
                  <div class='post-excerpt'>
                    <data:post.snippet/>
                  </div>
                  <div class='post-meta'>
                    <data:post.dateHeader/>
                  </div>
                </div>
              </article>
            </b:if>
          </b:loop>
          </div>
        </b:includable>
      </b:widget>
    </b:section>
  </div>
</body>
</html>`
  },
  {
    id: 'dark-theme',
    name: 'Dark Theme Template',
    description: 'A sleek dark theme perfect for tech blogs and portfolios',
    category: 'Dark',
    code: `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:version='2' class='v2' expr:dir='data:blog.languageDirection' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
  <meta content='IE=EmulateIE7' http-equiv='X-UA-Compatible'/>
  <b:if cond='data:blog.isMobile'>
    <meta content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0' name='viewport'/>
  <b:else/>
    <meta content='width=1100' name='viewport'/>
  </b:if>
  <b:include data='blog' name='all-head-content'/>
  <title><data:blog.pageTitle/></title>
  <b:skin><![CDATA[
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      line-height: 1.6;
      color: #e4e4e7;
      background: #0a0a0b;
      overflow-x: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      padding: 80px 0;
      text-align: center;
      position: relative;
    }
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23334155" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.3;
    }
    .header-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .header h1 {
      font-size: 3.5em;
      font-weight: 700;
      margin-bottom: 20px;
      background: linear-gradient(45deg, #60a5fa, #34d399, #fbbf24);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: glow 2s ease-in-out infinite alternate;
    }
    @keyframes glow {
      from { filter: drop-shadow(0 0 5px rgba(96, 165, 250, 0.5)); }
      to { filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.8)); }
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 60px 20px;
    }
    .post {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      margin-bottom: 40px;
      padding: 40px;
      border-radius: 16px;
      border: 1px solid #475569;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .post:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      border-color: #60a5fa;
    }
    .post::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #60a5fa, #34d399, #fbbf24);
    }
    .post-title {
      font-size: 2em;
      margin-bottom: 20px;
      color: #f1f5f9;
      font-weight: 600;
    }
    .post-title a {
      color: inherit;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    .post-title a:hover {
      background: linear-gradient(45deg, #60a5fa, #34d399);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .post-meta {
      color: #94a3b8;
      margin-bottom: 20px;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .post-body {
      color: #cbd5e1;
      font-size: 1.1em;
      line-height: 1.8;
    }
    .post-body code {
      background: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: inherit;
      color: #60a5fa;
    }
    @media (max-width: 768px) {
      .header h1 { font-size: 2.5em; }
      .container { padding: 40px 15px; }
      .post { padding: 25px; margin-bottom: 25px; }
      .post-title { font-size: 1.6em; }
    }
  ]]></b:skin>
</head>
<body>
  <header class='header'>
    <div class='header-content'>
      <h1><data:blog.title/></h1>
      <p style='font-size: 1.2em; color: #94a3b8;'><data:blog.description/></p>
    </div>
  </header>
  
  <div class='container'>
    <b:section class='main' id='main' maxwidgets='1' showaddelement='no'>
      <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog' version='1'>
        <b:includable id='main'>
          <b:loop values='data:posts' var='post'>
            <article class='post'>
              <div class='post-meta'>
                <data:post.dateHeader/> • <data:post.author/>
              </div>
              <h2 class='post-title'>
                <a expr:href='data:post.url'><data:post.title/></a>
              </h2>
              <div class='post-body'>
                <data:post.body/>
              </div>
            </article>
          </b:loop>
        </b:includable>
      </b:widget>
    </b:section>
  </div>
</body>
</html>`
  }
];
