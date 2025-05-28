
export interface BloggerTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const bloggerTemplates: BloggerTemplate[] = [
  {
    id: 'basic-blog',
    name: 'Basic Blog Template',
    description: 'A simple responsive blog template',
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
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: #333;
      color: white;
      padding: 20px;
      text-align: center;
      margin-bottom: 20px;
    }
    .main-wrapper {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .post {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .post-title {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .post-title a {
      color: #333;
      text-decoration: none;
    }
    .post-title a:hover {
      color: #0066cc;
    }
    .post-body {
      line-height: 1.6;
      color: #555;
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
    description: 'A modern responsive blog with sidebar',
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
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      padding: 30px;
      border-radius: 15px;
      margin-bottom: 30px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    .main-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }
    .posts-section {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    .sidebar {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      height: fit-content;
    }
    .post {
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #f0f0f0;
    }
    .post:last-child {
      border-bottom: none;
    }
    .post-title {
      font-size: 28px;
      margin-bottom: 15px;
      font-weight: 600;
    }
    .post-title a {
      color: #333;
      text-decoration: none;
      transition: color 0.3s ease;
    }
    .post-title a:hover {
      color: #667eea;
    }
    .post-meta {
      color: #888;
      margin-bottom: 15px;
      font-size: 14px;
    }
    .post-body {
      font-size: 16px;
      line-height: 1.8;
    }
    @media (max-width: 768px) {
      .main-content {
        grid-template-columns: 1fr;
      }
    }
  ]]></b:skin>
</head>
<body>
  <div class='container'>
    <header class='header'>
      <h1><data:blog.title/></h1>
      <p><data:blog.description/></p>
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
        <h3>About</h3>
        <p>Welcome to our blog! Here you'll find the latest updates and insights.</p>
        
        <h3 style='margin-top: 30px;'>Categories</h3>
        <ul>
          <li>Technology</li>
          <li>Lifestyle</li>
          <li>Travel</li>
        </ul>
      </aside>
    </div>
  </div>
</body>
</html>`
  }
];
