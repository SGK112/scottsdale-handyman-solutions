import React from 'react';

const BlogPostCard = ({ post }) => (
  <div className="blog-card">
    <img src={post.image} alt={post.title} className="blog-image" />
    <div className="blog-content">
      <div className="blog-meta">
        <span>{post.date}</span>
        <span>{post.readTime}</span>
      </div>
      <h4 className="blog-title">{post.title}</h4>
      <p className="blog-excerpt">{post.excerpt}</p>
      <a href={post.link} className="blog-link">Read More →</a>
    </div>
  </div>
);

export default BlogPostCard;
