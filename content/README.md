# Blog Content

This directory contains all blog posts and pages for the website.

## Structure

- **`posts/`** - Blog articles and posts
- **`archives.md`** - Archive page configuration

## Creating New Posts

To create a new blog post:

```bash
hugo new posts/your-post-title.md
```

This will create a new Markdown file in `posts/` with the default front matter template.

## Front Matter

Each post should have front matter at the top:

```markdown
---
title: "Your Post Title"
date: 2024-11-07
description: "A brief description of your post"
draft: true
---
```

**Important:** Set `draft: false` when you're ready to publish the post.

## Writing

Write your content below the front matter using standard Markdown syntax. The content here is kept separate from the site infrastructure for cleaner organization.

