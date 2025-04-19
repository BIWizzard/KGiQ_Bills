// src/components/layout/Layout.tsx (Complete File - Updated)
import React from 'react';

interface LayoutProps {
  children: React.ReactNode; // Type for accepting child elements like page components
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    // Outer container using flex column to push footer down
    // Base background/text colors are now handled by body styles in index.css
    <div className="flex flex-col min-h-screen">

      {/* Header/Navbar Placeholder - Using KG-Blue with transparency/blur in dark mode */}
      <header className="bg-kg-blue dark:bg-kg-blue/80 shadow-sm sticky top-0 z-10 backdrop-blur-sm border-b border-kg-gray/20 dark:border-kg-blue/30">
        <nav className="container mx-auto px-4 py-3">
          {/* Using kg-green text in dark mode (we can adjust contrast later if needed) */}
          <h1 className="text-lg font-bold text-white dark:text-kg-green">KG iQ Bills Tracker</h1>
          {/* TODO: Add actual navbar links/buttons later */}
        </nav>
      </header>

      {/* Main Content Area */}
      {/* flex-grow allows this section to take up available space */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children} {/* This is where page-specific content will be rendered */}
      </main>

      {/* Footer Placeholder - Using subtle KG colors */}
      {/* Using a light gray for light mode footer, subtle ash/10 for dark mode */}
      <footer className="bg-gray-100 dark:bg-kg-ash/10 py-4 mt-auto">
        <div className="container mx-auto text-center text-xs text-kg-gray dark:text-kg-ash">
          &copy; {new Date().getFullYear()} KG iQ Bills Tracker. (Footer)
        </div>
      </footer>

    </div>
  );
};

export default Layout;