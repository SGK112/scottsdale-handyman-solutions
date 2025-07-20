const express = require('express');
const cors = require('cors');
const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // You'll need to set this
const REPO_OWNER = 'SGK112';
const REPO_NAME = 'scottsdale-handyman-solutions';

const octokit = new Octokit({
    auth: GITHUB_TOKEN
});

// Admin authentication middleware (simple token-based)
const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    // In production, use a secure token or proper OAuth
    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};

// Get current blog posts
app.get('/api/blog-posts', async (req, res) => {
    try {
        const appFile = await fs.readFile('./App.jsx', 'utf8');

        // Extract blog posts from the file using regex
        const blogPostsMatch = appFile.match(/const blogPosts = (\[[\s\S]*?\]);/);

        if (blogPostsMatch) {
            // Safely evaluate the blog posts array
            const blogPostsString = blogPostsMatch[1];
            const blogPosts = eval(blogPostsString);
            res.json(blogPosts);
        } else {
            res.status(404).json({ error: 'Blog posts not found' });
        }
    } catch (error) {
        console.error('Error reading blog posts:', error);
        res.status(500).json({ error: 'Failed to read blog posts' });
    }
});

// Add new blog post
app.post('/api/blog-posts', authenticateAdmin, async (req, res) => {
    try {
        const newPost = req.body;

        // Validate required fields
        if (!newPost.title || !newPost.content || !newPost.category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Add ID and date
        newPost.id = Date.now();
        newPost.date = new Date().toLocaleDateString();

        // Read current App.jsx
        const appFile = await fs.readFile('./App.jsx', 'utf8');

        // Find and update blog posts array
        const blogPostsMatch = appFile.match(/const blogPosts = (\[[\s\S]*?\]);/);

        if (blogPostsMatch) {
            const currentPosts = eval(blogPostsMatch[1]);
            currentPosts.unshift(newPost); // Add to beginning

            const newBlogPostsString = `const blogPosts = ${JSON.stringify(currentPosts, null, 2)};`;
            const updatedFile = appFile.replace(/const blogPosts = \[[\s\S]*?\];/, newBlogPostsString);

            // Write to file
            await fs.writeFile('./App.jsx', updatedFile);

            // Commit and push to GitHub
            await commitAndPush('Add new blog post: ' + newPost.title, [{
                path: 'App.jsx',
                content: updatedFile
            }]);

            res.json({ success: true, post: newPost });
        } else {
            res.status(500).json({ error: 'Could not find blog posts in file' });
        }
    } catch (error) {
        console.error('Error adding blog post:', error);
        res.status(500).json({ error: 'Failed to add blog post' });
    }
});

// Update existing blog post
app.put('/api/blog-posts/:id', authenticateAdmin, async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const updatedPost = req.body;

        const appFile = await fs.readFile('./App.jsx', 'utf8');
        const blogPostsMatch = appFile.match(/const blogPosts = (\[[\s\S]*?\]);/);

        if (blogPostsMatch) {
            const currentPosts = eval(blogPostsMatch[1]);
            const postIndex = currentPosts.findIndex(post => post.id === postId);

            if (postIndex === -1) {
                return res.status(404).json({ error: 'Post not found' });
            }

            currentPosts[postIndex] = { ...currentPosts[postIndex], ...updatedPost };

            const newBlogPostsString = `const blogPosts = ${JSON.stringify(currentPosts, null, 2)};`;
            const updatedFile = appFile.replace(/const blogPosts = \[[\s\S]*?\];/, newBlogPostsString);

            await fs.writeFile('./App.jsx', updatedFile);

            await commitAndPush('Update blog post: ' + updatedPost.title, [{
                path: 'App.jsx',
                content: updatedFile
            }]);

            res.json({ success: true, post: currentPosts[postIndex] });
        }
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ error: 'Failed to update blog post' });
    }
});

// Delete blog post
app.delete('/api/blog-posts/:id', authenticateAdmin, async (req, res) => {
    try {
        const postId = parseInt(req.params.id);

        const appFile = await fs.readFile('./App.jsx', 'utf8');
        const blogPostsMatch = appFile.match(/const blogPosts = (\[[\s\S]*?\]);/);

        if (blogPostsMatch) {
            const currentPosts = eval(blogPostsMatch[1]);
            const filteredPosts = currentPosts.filter(post => post.id !== postId);

            const newBlogPostsString = `const blogPosts = ${JSON.stringify(filteredPosts, null, 2)};`;
            const updatedFile = appFile.replace(/const blogPosts = \[[\s\S]*?\];/, newBlogPostsString);

            await fs.writeFile('./App.jsx', updatedFile);

            await commitAndPush('Delete blog post', [{
                path: 'App.jsx',
                content: updatedFile
            }]);

            res.json({ success: true });
        }
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ error: 'Failed to delete blog post' });
    }
});

// Handle form submissions
app.post('/api/forms/:type', async (req, res) => {
    try {
        const formType = req.params.type;
        const formData = req.body;

        // Add timestamp
        formData.submittedAt = new Date().toISOString();
        formData.id = Date.now();

        // Read or create submissions file
        let submissions = [];
        try {
            const existingData = await fs.readFile('./form-submissions.json', 'utf8');
            submissions = JSON.parse(existingData);
        } catch (error) {
            // File doesn't exist, start with empty array
        }

        submissions.push({
            type: formType,
            data: formData
        });

        // Write back to file
        await fs.writeFile('./form-submissions.json', JSON.stringify(submissions, null, 2));

        // Commit to GitHub
        await commitAndPush(`New ${formType} form submission`, [{
            path: 'form-submissions.json',
            content: JSON.stringify(submissions, null, 2)
        }]);

        res.json({ success: true, message: 'Form submitted successfully' });

        // Optional: Send email notification
        // await sendEmailNotification(formType, formData);

    } catch (error) {
        console.error('Error handling form submission:', error);
        res.status(500).json({ error: 'Failed to submit form' });
    }
});

// Get form submissions (admin only)
app.get('/api/submissions', authenticateAdmin, async (req, res) => {
    try {
        const data = await fs.readFile('./form-submissions.json', 'utf8');
        const submissions = JSON.parse(data);
        res.json(submissions);
    } catch (error) {
        res.json([]); // Return empty array if file doesn't exist
    }
});

// Update project gallery
app.put('/api/projects', authenticateAdmin, async (req, res) => {
    try {
        const newProjects = req.body.projects;

        const appFile = await fs.readFile('./App.jsx', 'utf8');

        // Find and replace project gallery data
        const projectMatch = appFile.match(/const projectGallery = (\[[\s\S]*?\]);/);

        if (projectMatch) {
            const newProjectsString = `const projectGallery = ${JSON.stringify(newProjects, null, 2)};`;
            const updatedFile = appFile.replace(/const projectGallery = \[[\s\S]*?\];/, newProjectsString);

            await fs.writeFile('./App.jsx', updatedFile);

            await commitAndPush('Update project gallery', [{
                path: 'App.jsx',
                content: updatedFile
            }]);

            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Could not find project gallery in file' });
        }
    } catch (error) {
        console.error('Error updating projects:', error);
        res.status(500).json({ error: 'Failed to update projects' });
    }
});

// Helper function to commit and push to GitHub
async function commitAndPush(message, files) {
    try {
        // Get the current commit SHA
        const { data: ref } = await octokit.rest.git.getRef({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            ref: 'heads/main'
        });

        const currentCommitSha = ref.object.sha;

        // Get the current tree
        const { data: currentCommit } = await octokit.rest.git.getCommit({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            commit_sha: currentCommitSha
        });

        // Create blobs for each file
        const blobs = await Promise.all(
            files.map(async (file) => {
                const { data: blob } = await octokit.rest.git.createBlob({
                    owner: REPO_OWNER,
                    repo: REPO_NAME,
                    content: Buffer.from(file.content).toString('base64'),
                    encoding: 'base64'
                });
                return {
                    path: file.path,
                    mode: '100644',
                    type: 'blob',
                    sha: blob.sha
                };
            })
        );

        // Create new tree
        const { data: newTree } = await octokit.rest.git.createTree({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            base_tree: currentCommit.tree.sha,
            tree: blobs
        });

        // Create new commit
        const { data: newCommit } = await octokit.rest.git.createCommit({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            message: message,
            tree: newTree.sha,
            parents: [currentCommitSha]
        });

        // Update the reference
        await octokit.rest.git.updateRef({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            ref: 'heads/main',
            sha: newCommit.sha
        });

        console.log('Successfully committed and pushed:', message);
    } catch (error) {
        console.error('Error committing to GitHub:', error);
        throw error;
    }
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Make sure to set GITHUB_TOKEN and ADMIN_TOKEN environment variables');
});
