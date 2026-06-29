# Personal Website

This is a small Hugo-powered personal website for Sandeep Suresh.

## Structure

- `content/_index.md` - home page metadata
- `content/writing/` - writing section and future essays or notes
- `content/contact.md` - contact page scaffold
- `content/career.md` - career page scaffold
- `layouts/` - custom site templates
- `static/css/site.css` - site styling

## Preview

Run the local Hugo server:

```bash
hugo server
```

Then visit `http://localhost:1313`.

If Hugo tries to write its cache somewhere restricted, pass a writable cache directory:

```bash
hugo server --cacheDir /tmp/hugo-cache-sandeepsuresh
```

## Add Writing

Create a new writing page:

```bash
hugo new writing/my-piece.md
```

Set `draft = false` in the front matter when it is ready to publish.
