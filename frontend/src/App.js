import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';

function App() {
  return (
    <Router>
      <div className="container py-4">
        <h1 className="text-center mb-4">My Blog App</h1>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;






