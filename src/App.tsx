// src/App.tsx (Updated to use ProtectedRoute)
import { Routes, Route } from 'react-router-dom'; // Removed Outlet
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Import ProtectedRoute

function App() {

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
          <Route path="/" element={<HomePage />} />
          {/* Add other protected routes here later inside this wrapper */}
          {/* e.g., <Route path="/dashboard" element={<DashboardPage />} /> */}
        </Route>

        {/* TODO: Add a 404 Not Found route */}
      </Routes>
    </Layout>
  );
}

export default App;