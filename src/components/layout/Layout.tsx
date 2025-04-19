// src/components/layout/Layout.tsx (Complete File - Updated with Logo)
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for logo link
import kgIqLogo from '../../assets/KG_iQ_logo.svg'; // Import the SVG logo

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Header/Navbar Placeholder - Using KG-Blue with transparency/blur & Logo */}
      <header className="bg-kg-blue dark:bg-kg-blue/80 shadow-sm sticky top-0 z-10 backdrop-blur-sm border-b border-kg-gray/20 dark:border-kg-blue/30">
        <nav className="container mx-auto px-4 py-2 flex items-center justify-between"> {/* Adjusted padding slightly, added flex */}
          {/* Logo */}
          <Link to="/" className="flex-shrink-0"> {/* Link logo to homepage */}
            <img
              src={kgIqLogo}
              alt="KG iQ Logo"
              className="h-8 w-auto" // Adjust height (h-8 = 2rem/32px) as needed
            />
          </Link>

          {/* TODO: Add actual navbar links/buttons later on the right */}
          <div className="text-white dark:text-kg-green text-sm">
            {/* Placeholder for Nav Links */}
            <span>Nav Links Go Here</span>
          </div>
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