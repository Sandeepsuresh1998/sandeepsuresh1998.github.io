# Creating a New Post

This guide will walk you through the process of creating a new post for your Hugo-based blog using the PaperMod theme.

## Steps to Create a New Post

1. Open your terminal and navigate to the root directory of your Hugo project.

2. Run the following command to create a new post:

   ```
   hugo new posts/your-post-title.md
   ```

   Replace `your-post-title` with the desired title of your post (use hyphens instead of spaces).

3. This command will create a new Markdown file in the `content/posts/` directory with some default front matter.

4. Open the newly created file in your preferred text editor. You'll see something like this at the top of the file:

   ```markdown
   +++
   title = 'Your Post Title'
   date = 2024-03-01T00:00:00Z
   draft = true
   +++
   ```

5. Modify the front matter as needed:
   - Update the `title` if necessary
   - Set `draft = false` when you're ready to publish
   - Add a `description` field if you want a short summary to appear on the home page
   - Add any other relevant metadata (e.g., tags, categories)

6. Below the front matter, write your post content using Markdown syntax.

7. To include images, place them in the `static/images/` directory and reference them in your post like this:

   ```markdown
   ![Alt text](/images/your-image.jpg)
   ```

8. Save your file when you're done editing.

## Preview Your Post

To preview your post:

1. Run the Hugo server with drafts enabled:

   ```
   hugo server -D
   ```

2. Open a web browser and go to `http://localhost:1313` to see your site with the new post.

## Publishing Your Post

When you're ready to publish:

1. Set `draft = false` in the post's front matter.
2. Commit your changes to your Git repository.
3. Push the changes to your hosting platform (e.g., GitHub Pages).

---

## 🚨 Troubleshooting

### **My new post isn't showing up!**

**Check these things in order:**

1. **Is the post marked as a draft?**
   - Open your post file in `content/posts/`
   - Check if `draft = true` in the front matter
   - Either change it to `draft = false` OR run `hugo server -D` to view drafts

2. **Is the Hugo server running?**
   - Check your terminal for the message: `Web Server is available at http://localhost:1313/`
   - If not running, start it with: `hugo server -D`
   - The `-D` flag includes draft posts

3. **Is the theme missing?**
   - If you see warnings like "found no layout file for html", the theme is missing
   - Run: `git submodule update --init --recursive`
   - This downloads the PaperMod theme files
   - Restart the server: `hugo server -D`

### **Starting fresh after cloning the repo**

When you first clone this repo or come back after a while:

```bash
cd /path/to/sandeepsuresh1998.github.io

# Initialize the theme (IMPORTANT - do this first!)
git submodule update --init --recursive

# Start the development server
hugo server -D

# Visit http://localhost:1313 in your browser
```

### **Common Commands**

| Problem | Solution |
|---------|----------|
| Theme is missing | `git submodule update --init --recursive` |
| Server won't start | Make sure Hugo is installed: `hugo version` |
| Install Hugo | `brew install hugo` |
| Post not showing | Check `draft = true/false` in front matter |
| Changes not updating | Restart server: Kill with `Ctrl+C`, then `hugo server -D` |
| See drafts locally | Always use `hugo server -D` (with `-D` flag) |

### **Quick Workflow Reminder**

1. **Create post:** `hugo new posts/my-post.md`
2. **Edit content:** Open `content/posts/my-post.md` in your editor
3. **Preview:** Make sure `hugo server -D` is running, visit `http://localhost:1313`
4. **Publish:** Change `draft = false` in the post
5. **Deploy:** `git add .`, `git commit -m "New post"`, `git push`