// Helper to extract frontmatter (for preview if needed)
function parseMarkdownWithFrontmatter(md) {
  const frontmatterRegex = /^---\s*\n([\s\S]+?)\n---\s*\n?/;
  const match = md.match(frontmatterRegex);

  let meta = {};
  let content = md;

  if (match) {
    const yaml = match[1];
    content = md.slice(match[0].length);
    yaml.split('\n').forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length > 0) {
        let value = rest.join(':').trim();
        value = value.replace(/^["']|["']$/g, '');
        meta[key.trim()] = value;
      }
    });
  }
  return { meta, content };
}

// Get 'post' parameter from URL
const urlParams = new URLSearchParams(window.location.search);
const postFile = urlParams.get('post');

const postListEl = document.getElementById('post-list');
const blogContentEl = document.getElementById('blog-content');
const searchInput = document.getElementById('search');

// 1. Fetch posts.json and render list
let allPosts = [];
fetch('posts/posts.json')
  .then(resp => resp.json())
  .then(posts => {
    allPosts = posts;
    renderPostList(posts);

    // If a post is specified in URL, load it
    if (postFile) {
      loadPost(postFile);
    }
  });

// 2. Render post list
function renderPostList(posts) {
  postListEl.innerHTML = '';
  posts.forEach(post => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `?post=${encodeURIComponent(post.file)}`;
    a.textContent = post.title;
    li.appendChild(a);
    if (post.date) {
      const dateSpan = document.createElement('span');
      dateSpan.className = 'meta-date';
      dateSpan.textContent = ' — ' + post.date;
      li.appendChild(dateSpan);
    }
    postListEl.appendChild(li);
  });
}

// 3. Load and render a post
function loadPost(filename) {
  fetch(`posts/${filename}`)
    .then(response => {
      if (!response.ok) throw new Error("File not found");
      return response.text();
    })
    .then(md => {
      const { meta, content } = parseMarkdownWithFrontmatter(md);
      let metaHtml = '';
      if (meta.date) metaHtml += `<div class="meta-date">${meta.date}</div>`;
      if (meta.tags) metaHtml += `<div class="meta-tags">Tags: ${meta.tags}</div>`;
      if (meta.description) metaHtml += `<div class="meta-description">${meta.description}</div>`;
      blogContentEl.innerHTML = `<a href="index.html">&larr; Back to all posts</a><hr>` +
        metaHtml + marked.parse(content);
      document.title = (meta.title || "Blog Post") + " | My Blog";
    })
    .catch(err => {
      blogContentEl.innerHTML = "<p>Post not found.</p>";
      document.title = "Blog Post | My Blog";
      console.error(err);
    });
}

// 4. Add search functionality
searchInput.addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const filtered = allPosts.filter(post =>
    post.title.toLowerCase().includes(query) ||
    (post.description && post.description.toLowerCase().includes(query)) ||
    (post.tags && post.tags.join(',').toLowerCase().includes(query))
  );
  renderPostList(filtered);
});

// 5. If on a post, hide post list and search
if (postFile) {
  postListEl.style.display = 'none';
  searchInput.style.display = 'none';
}