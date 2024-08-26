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