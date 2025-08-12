import React from 'react';
import BlogPostCard from './BlogPostCard';
import { blogPosts } from '../data';

const BlogSection = () => {
  return (
    <section id="blog" className="blog">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">From Our Blog</h2>
          <p className="section-description">Tips, tricks, and insights to help you maintain and improve your home.</p>
        </div>
        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <BlogPostCard key={index} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
