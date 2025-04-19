// src/App.tsx (Updated for Basic Routing)
import { Routes, Route } from 'react-router-dom'; // Import routing components
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage'; // Import Page components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  // Authentication state logic (useState, useEffect, handleLogout) is now moved to HomePage.tsx
  // App.tsx now primarily handles layout and routing structure.

  return (
    <Layout>
      {/* --- Routes define which page component renders based on the URL --- */}
      <Routes>
        {/* Route for the homepage (path="/") */}
        <Route path="/" element={<HomePage />} />

        {/* Route for the login page (path="/login") */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route for the signup page (path="/signup") */}
        <Route path="/signup" element={<SignupPage />} />

        {/* TODO: Add a 404 Not Found route later */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
      {/* --- End Routes --- */}
    </Layout>
  );
}

export default App;