import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NgoSignup from "./pages/NgoSignup";
import Navbar from "./components/Navbar";
import Donate from "./pages/Donate";
import HowIt from "./pages/HowIt";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NgoDirectory from "./pages/NgoDirectory";
import NgoProfileView from "./pages/NgoProfileView";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Routes with Navbar */}
      <Route path="/" element={<Navbar />}>
        <Route index element={<Landing />} />
        <Route path="/how-it-works" element={<HowIt />} />
        <Route path="/about" element={<About />} />

        {/* Redirect logged-in users away from login/signup */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
          }
        />
        <Route
          path="/signup/ngo"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <NgoSignup />}
        />
        <Route path="/ngos" element={<NgoDirectory />} />
        <Route path="/ngos/:id" element={<NgoProfileView />} />
      </Route>

      {/* Dashboard, Donate & History — outside Navbar layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donate"
        element={
          <ProtectedRoute>
            <Donate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
