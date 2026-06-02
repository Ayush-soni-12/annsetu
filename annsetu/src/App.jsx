import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Donate from "./pages/Donate";
import HowIt from "./pages/HowIt";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Routes with Navbar */}
      <Route path="/" element={<Navbar />}>
        <Route index element={<Landing />} />
        <Route path="/how-it-works" element={<HowIt />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<Donate />} />

        {/* Redirect logged-in users away from login/signup */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
        />
      </Route>

      {/* Dashboard — outside Navbar layout (has its own top bar) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
