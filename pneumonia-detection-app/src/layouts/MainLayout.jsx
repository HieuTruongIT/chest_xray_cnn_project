import React from 'react';
import { Link } from 'react-router-dom';

export default function MainLayout({ children }) {
  return (
    <div className="container mx-auto">
      <header className="bg-blue-600 text-white p-4">
        <Link to="/" className="text-2xl font-semibold">Pneumonia Detection App</Link>
      </header>
      <main>{children}</main>
    </div>
  );
}

