// The name of markdown file (in /blog/posts/)
const postFile = "2025-05-29-first-blog.md"; // Change as needed

fetch(`posts/${postFile}`)
  .then(response => response.text())
  .then(md => {
    // Use marked.js to convert markdown to HTML
    const html = marked.parse(md);
    document.getElementById('blog-content').innerHTML = html;
  })
  .catch(err => {
    document.getElementById('blog-content').innerHTML = "Failed to load post.";
    console.error(err);
  });
