// src/components/layout/Layout.tsx (Updated Version)
import React from 'react';

interface LayoutProps {
  children: React.ReactNode; 
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    // Uses body styles now, just handles flex layout
    <div className="flex flex-col min-h-screen"> 

      {/* Header/Navbar Placeholder - Using KG colors & effects */}
      <header className="bg-kg-blue dark:bg-kg-ash2/80 shadow-sm sticky top-0 z-10 backdrop-blur-sm border-b border-kg-gray/20 dark:border-kg-ash/30"> 
        <nav className="container mx-auto px-4 py-3">
          {/* Using kg-green text in dark mode (might need contrast check) */}
          <h1 className="text-lg font-bold text-white dark:text-kg-green">KG iQ Bills Tracker</h1> 
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children} 
      </main>

      {/* Footer Placeholder - Using subtle KG colors */}
      <footer className="bg-gray-100 dark:bg-kg-ash/10 py-4 mt-auto"> 
        <div className="container mx-auto text-center text-xs text-kg-gray dark:text-kg-ash">
          &copy; {new Date().getFullYear()} KG iQ Bills Tracker. (Footer)
        </div>
      </footer>

    </div>
  );
};

export default Layout;