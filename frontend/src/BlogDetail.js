import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/blog/${id}/`)
      .then((res) => res.json())
      .then((data) => setBlog(data))
      .catch((err) => console.error('Error loading blog:', err));
  }, [id]);

  if (!blog) return <p className="text-center">Loading...</p>;

  return (
    <div className="container">
      <Link to="/" className="btn btn-secondary mb-3">← Back</Link>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">{blog.title}</h2>
          <p className="card-text">{blog.content}</p>
          <p className="text-muted">
            <strong>Author:</strong> {blog.author} <br />
            <strong>Tags:</strong> {blog.tags}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;

