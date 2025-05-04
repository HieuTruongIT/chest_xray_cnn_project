import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Pneumonia Detection App</h1>
      <Link to="/upload" className="bg-blue-600 text-white px-6 py-2 rounded">
        Get Started
      </Link>
    </div>
  );
}

