// src/components/Layout/Layout.jsx
import React, { useState } from 'react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-4 flex justify-center">
        <div className="w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
