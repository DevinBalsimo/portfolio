// Helper function to extract YAML frontmatter and markdown content
function parseMarkdownWithFrontmatter(md) {
  // Match frontmatter between --- and ---
  const frontmatterRegex = /^---\s*\n([\s\S]+?)\n---\s*\n?/;
  const match = md.match(frontmatterRegex);

  let meta = {};
  let content = md;

  if (match) {
    // Extract frontmatter and remove it from content
    const yaml = match[1];
    content = md.slice(match[0].length);

    // Parse YAML (works for simple key: value pairs)
    yaml.split('\n').forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length > 0) {
        let value = rest.join(':').trim();
        // Remove wrapping quotes if present
        value = value.replace(/^["']|["']$/g, '');
        meta[key.trim()] = value;
      }
    });
  }

  return { meta, content };
}

// Choose which post to load (could enhance to make this dynamic)
const postFile = "2025-05-29-first-blog.md"; // Or get from URL, etc.

fetch(`posts/${postFile}`)
  .then(response => {
    if (!response.ok) throw new Error("File not found");
    return response.text();
  })
  .then(md => {
    const { meta, content } = parseMarkdownWithFrontmatter(md);

    // Set document title and h1 from frontmatter
    if (meta.title) {
      document.title = meta.title + " | My Blog";
      document.querySelector('h1').textContent = meta.title;
    }

    // Show meta info (date, tags, etc.)
    let metaHtml = '';
    if (meta.date) {
      metaHtml += `<div class="meta-date">${meta.date}</div>`;
    }
    if (meta.tags) {
      metaHtml += `<div class="meta-tags">Tags: ${meta.tags}</div>`;
    }
    if (meta.description) {
      metaHtml += `<div class="meta-description">${meta.description}</div>`;
    }

    // Render meta info and markdown content
    document.getElementById('blog-content').innerHTML =
      metaHtml + marked.parse(content);
  })
  .catch(err => {
    document.getElementById('blog-content').innerHTML =
      "<p>Failed to load post.</p>";
    console.error(err);
  });