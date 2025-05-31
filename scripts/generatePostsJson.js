const fs = require('fs');
const path = require('path');

// Directory containing posts
const POSTS_DIR = path.join(__dirname, '../devinbalsimo.com/blog/posts');
const OUTPUT_FILE = path.join(POSTS_DIR, 'posts.json');

function extractFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]+?)\n---/);
  if (!match) return {};
  const lines = match[1].split('\n');
  const meta = {};
  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    if (!key || !rest.length) continue;
    let value = rest.join(':').trim();
    value = value.replace(/^["']|["']$/g, '');
    if (key.trim() === 'tags') {
      // Parse tag arrays
      value = value.replace(/^\[|\]$/g, '').split(',').map(t => t.trim());
    }
    meta[key.trim()] = value;
  }
  return meta;
}

const posts = [];

fs.readdirSync(POSTS_DIR).forEach(file => {
  if (file.endsWith('.md')) {
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const meta = extractFrontmatter(content);
    if (meta.title) {
      posts.push({
        file,
        title: meta.title,
        date: meta.date || '',
        tags: meta.tags || [],
        description: meta.description || ''
      });
    }
  }
});

posts.sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
console.log('posts.json generated with', posts.length, 'posts.');
