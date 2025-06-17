import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    author: '',
    tags: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [searchTerm]);

  const fetchBlogs = () => {
    setLoading(true);
    setError(null);
    const url = searchTerm
      ? `http://127.0.0.1:8000/api/blog/?search=${encodeURIComponent(searchTerm)}`
      : `http://127.0.0.1:8000/api/blog/`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch blogs');
        return res.json();
      })
      .then((data) => setBlogs(data))
      .catch((err) => {
        console.error('Error fetching blogs:', err);
        setError('Could not load blogs. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://127.0.0.1:8000/api/blog/${editingId}/`
      : 'http://127.0.0.1:8000/api/blog/';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to submit blog');
        return res.json();
      })
      .then(() => {
        setForm({ title: '', content: '', author: '', tags: '' });
        setEditingId(null);
        fetchBlogs();
      })
      .catch((err) => {
        console.error('Error submitting blog:', err);
        setError('Failed to save blog. Please check the inputs.');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    setLoading(true);
    setError(null);

    fetch(`http://127.0.0.1:8000/api/blog/${id}/`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        fetchBlogs();
      })
      .catch((err) => {
        console.error('Error deleting blog:', err);
        setError('Failed to delete blog.');
        setLoading(false);
      });
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      tags: blog.tags,
    });
    setEditingId(blog.id);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{editingId ? 'Edit Blog' : 'Add Blog'}</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <input className="form-control" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input className="form-control" name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input className="form-control" name="tags" placeholder="Tags" value={form.tags} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <textarea className="form-control" name="content" placeholder="Content" value={form.content} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary me-2" disabled={loading}>
          {editingId ? 'Update' : 'Add'} Blog
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary" onClick={() => {
            setForm({ title: '', content: '', author: '', tags: '' });
            setEditingId(null);
          }}>
            Cancel Edit
          </button>
        )}
      </form>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by title, author, or tags"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {loading && <p>Loading blogs...</p>}

      {!loading && blogs.length > 0 ? (
        blogs.map((blog) => (
          <div key={blog.id} className="card mb-3">
            <div className="card-body">
              <h4 className="card-title">
                <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
              </h4>
              <p className="card-text">{blog.content}</p>
              <p className="text-muted">
                <strong>Author:</strong> {blog.author}<br />
                <strong>Tags:</strong> {blog.tags}
              </p>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(blog)} disabled={loading}>
                Edit
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(blog.id)} disabled={loading}>
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        !loading && <p>No blogs found.</p>
      )}
    </div>
  );
}

export default BlogList;



