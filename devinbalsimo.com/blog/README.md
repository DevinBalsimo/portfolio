# BLOG

### File Structure 

This /blog folder has the following 
- index.html
- script.js
- style.css
- /posts/ for individual md blog posts
- /libs/ for javascript libraries I'm not using CDN for

### Hosting 

For now, this repo will be hosted by Github Pages, 
However in the future I will link to an external, custom-domain.

### Javascript Libraries 

I will be using CDN (content delivery network) for my Javascript libraries, since it reduces 
the amount of files for the end-user to download, in hopes that they have already cached that library 
from a different website they previously visited, or at least will re-download it from a server that 
is physically closer to them. 

### Functionality 

- Using a posts.json file as a manifest of a ll posts, which contains all blog titles and metadata, also allowing js
to fetch blog post titles and serve them as html links. This makes everything dynamic.

- Search function added. 

#### marked.js
- This will read the md blog file, convert it to html, and then serve it up as a static page. Beautiful


