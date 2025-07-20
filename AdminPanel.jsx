import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    Eye,
    Users,
    FileText,
    Settings,
    Calendar,
    BarChart3,
    LogOut
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminPanel = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [blogPosts, setBlogPosts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [showNewPostForm, setShowNewPostForm] = useState(false);

    const authToken = localStorage.getItem('adminToken');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'blog' || activeTab === 'dashboard') {
                const postsResponse = await fetch(`${API_BASE_URL}/blog-posts`);
                if (postsResponse.ok) {
                    const posts = await postsResponse.json();
                    setBlogPosts(posts);
                }
            }

            if (activeTab === 'submissions' || activeTab === 'dashboard') {
                const submissionsResponse = await fetch(`${API_BASE_URL}/submissions`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (submissionsResponse.ok) {
                    const subs = await submissionsResponse.json();
                    setSubmissions(subs);
                }
            }
        } catch (error) {
            setError('Failed to load data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBlogPost = async (postData) => {
        setLoading(true);
        try {
            const url = editingPost
                ? `${API_BASE_URL}/blog-posts/${editingPost.id}`
                : `${API_BASE_URL}/blog-posts`;

            const method = editingPost ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                await loadData();
                setEditingPost(null);
                setShowNewPostForm(false);
                alert('Blog post saved and pushed to GitHub!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
        } catch (error) {
            setError('Failed to save blog post: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlogPost = async (postId) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/blog-posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                await loadData();
                alert('Blog post deleted and changes pushed to GitHub!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
        } catch (error) {
            setError('Failed to delete blog post: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const BlogPostForm = ({ post, onSave, onCancel }) => {
        const [formData, setFormData] = useState({
            title: post?.title || '',
            excerpt: post?.excerpt || '',
            content: post?.content || '',
            category: post?.category || 'Home Maintenance',
            image: post?.image || '',
            readTime: post?.readTime || '5 min read',
            featured: post?.featured || false,
            tags: post?.tags ? post.tags.join(', ') : ''
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            const postData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };
            onSave(postData);
        };

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    maxWidth: '800px',
                    width: '90%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                            {post ? 'Edit Blog Post' : 'New Blog Post'}
                        </h2>
                        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} color="#6b7280" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            >
                                <option>Home Maintenance</option>
                                <option>Repairs</option>
                                <option>Renovations</option>
                                <option>Seasonal Tips</option>
                                <option>DIY Guides</option>
                                <option>Safety</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                    Read Time
                                </label>
                                <input
                                    type="text"
                                    value={formData.readTime}
                                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                    placeholder="5 min read"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Excerpt *
                            </label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                required
                                rows="3"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Content * (Use **Text** for headings)
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                                rows="10"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="plumbing, maintenance, tips"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            />
                            <label htmlFor="featured" style={{ fontWeight: '600', color: '#374151' }}>
                                Featured Article
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                            <button
                                type="button"
                                onClick={onCancel}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '8px',
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    borderRadius: '8px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.5 : 1
                                }}
                            >
                                {loading ? 'Saving...' : 'Save & Push to GitHub'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const Dashboard = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>Admin Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <FileText size={32} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Blog Posts</h3>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{blogPosts.length}</p>
                    <p style={{ opacity: 0.9 }}>Published articles</p>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(72, 187, 120, 0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <Users size={32} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Submissions</h3>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{submissions.length}</p>
                    <p style={{ opacity: 0.9 }}>Form submissions</p>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(237, 137, 54, 0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <BarChart3 size={32} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>This Month</h3>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {submissions.filter(s => {
                            const submissionDate = new Date(s.data.submittedAt);
                            const thisMonth = new Date();
                            return submissionDate.getMonth() === thisMonth.getMonth() &&
                                submissionDate.getFullYear() === thisMonth.getFullYear();
                        }).length}
                    </p>
                    <p style={{ opacity: 0.9 }}>New submissions</p>
                </div>
            </div>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>
                    Recent Activity
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {submissions.slice(-5).reverse().map((submission, index) => (
                        <div key={index} style={{
                            padding: '1rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            borderLeft: '4px solid #3b82f6'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600', color: '#1f2937' }}>
                                    {submission.type.charAt(0).toUpperCase() + submission.type.slice(1)} Submission
                                </span>
                                <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                    {new Date(submission.data.submittedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>
                                {submission.data.name} - {submission.data.email}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const BlogManager = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>Blog Management</h1>
                <button
                    onClick={() => setShowNewPostForm(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={20} />
                    New Post
                </button>
            </div>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    padding: '1rem 1.5rem',
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: '600',
                    color: '#374151'
                }}>
                    Blog Posts ({blogPosts.length})
                </div>

                <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                    {blogPosts.map((post) => (
                        <div key={post.id} style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid #f3f4f6',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>{post.title}</h3>
                                    {post.featured && (
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            backgroundColor: '#fbbf24',
                                            color: 'white',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            FEATURED
                                        </span>
                                    )}
                                </div>
                                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{post.excerpt}</p>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#9ca3af' }}>
                                    <span>{post.category}</span>
                                    <span>{post.date}</span>
                                    <span>{post.readTime}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                                <button
                                    onClick={() => setEditingPost(post)}
                                    style={{
                                        padding: '0.5rem',
                                        backgroundColor: '#f3f4f6',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Edit2 size={16} color="#4b5563" />
                                </button>
                                <button
                                    onClick={() => handleDeleteBlogPost(post.id)}
                                    style={{
                                        padding: '0.5rem',
                                        backgroundColor: '#fef2f2',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Trash2 size={16} color="#dc2626" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const SubmissionsManager = () => (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '2rem' }}>
                Form Submissions
            </h1>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    padding: '1rem 1.5rem',
                    backgroundColor: '#f8fafc',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: '600',
                    color: '#374151'
                }}>
                    All Submissions ({submissions.length})
                </div>

                <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                    {submissions.reverse().map((submission, index) => (
                        <div key={index} style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid #f3f4f6'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: submission.type === 'quote' ? '#dbeafe' : '#f0fdf4',
                                    color: submission.type === 'quote' ? '#1e40af' : '#166534',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    {submission.type.toUpperCase()}
                                </span>
                                <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                    {new Date(submission.data.submittedAt).toLocaleString()}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <strong style={{ color: '#374151' }}>Name:</strong> {submission.data.name}
                                </div>
                                <div>
                                    <strong style={{ color: '#374151' }}>Email:</strong> {submission.data.email}
                                </div>
                                <div>
                                    <strong style={{ color: '#374151' }}>Phone:</strong> {submission.data.phone}
                                </div>
                                {submission.data.service && (
                                    <div>
                                        <strong style={{ color: '#374151' }}>Service:</strong> {submission.data.service}
                                    </div>
                                )}
                            </div>

                            {submission.data.message && (
                                <div style={{ marginTop: '1rem' }}>
                                    <strong style={{ color: '#374151' }}>Message:</strong>
                                    <p style={{ color: '#4b5563', marginTop: '0.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                                        {submission.data.message}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            {/* Sidebar */}
            <div style={{
                width: '250px',
                backgroundColor: '#1f2937',
                color: 'white',
                padding: '2rem 0'
            }}>
                <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Admin Panel</h2>
                </div>

                <nav>
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                        { id: 'blog', label: 'Blog Posts', icon: FileText },
                        { id: 'submissions', label: 'Submissions', icon: Users },
                        { id: 'settings', label: 'Settings', icon: Settings }
                    ].map(item => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: activeTab === item.id ? '#374151' : 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    fontSize: '0.95rem',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <Icon size={18} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div style={{ position: 'absolute', bottom: '2rem', left: '1.5rem', right: '1.5rem' }}>
                    <button
                        onClick={onLogout}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '0.95rem'
                        }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '2rem' }}>
                {error && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        border: '1px solid #fecaca'
                    }}>
                        {error}
                        <button
                            onClick={() => setError(null)}
                            style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {loading && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        Loading...
                    </div>
                )}

                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'blog' && <BlogManager />}
                {activeTab === 'submissions' && <SubmissionsManager />}
                {activeTab === 'settings' && (
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>Settings</h1>
                        <p style={{ color: '#6b7280' }}>Settings panel coming soon...</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {(editingPost || showNewPostForm) && (
                <BlogPostForm
                    post={editingPost}
                    onSave={handleSaveBlogPost}
                    onCancel={() => {
                        setEditingPost(null);
                        setShowNewPostForm(false);
                    }}
                />
            )}
        </div>
    );
};

export default AdminPanel;
