---
name: add-article
description: Add a new article/thought to the Thoughts section of the beausbrain-website. Use when Beau wants to publish a new reflection, essay, or blog post. Accepts a title, date, excerpt, and full body content.
tools: Read, Edit, Write, Bash
---

Add a new article to the Thoughts section. You need: title, date (e.g. "July 2026"), excerpt (2-3 sentence preview), slug (URL-safe identifier like "my-article-title"), and the full article body.

Steps:

1. **Update the Thoughts component** — Read `app/components/Thoughts.jsx` and add the new article object to the `articles` array:
   ```js
   {
     title: "...",
     date: "...",
     excerpt: "...",
     slug: "..."
   }
   ```
   Insert at the top of the array so newest articles appear first.

2. **Create the article page** — Create `app/thoughts/[slug]/page.jsx` if the dynamic route doesn't exist yet. Then create `app/thoughts/[slug-value]/page.jsx` (or use the dynamic route) with the full article content.

   Dynamic route template (`app/thoughts/[slug]/page.jsx`):
   ```jsx
   import articles from '@/data/articles';
   import { notFound } from 'next/navigation';

   export default function ArticlePage({ params }) {
     const article = articles.find(a => a.slug === params.slug);
     if (!article) notFound();
     return (
       <main className="article-page">
         <h1>{article.title}</h1>
         <span className="article-date">{article.date}</span>
         <div className="article-body">{article.body}</div>
       </main>
     );
   }
   ```

3. **Confirm** by reporting the new article slug and suggesting a test at `http://localhost:3000/thoughts/[slug]`.

Keep Beau's voice: direct, warm, experience-driven. No jargon.
