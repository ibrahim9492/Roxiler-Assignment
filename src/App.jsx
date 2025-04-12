import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import UserStores from "./pages/UserStores";
import ListUsers from "./pages/ListUsers";
import ListStores from "./pages/ListStores";
import UpdatePassword from "./pages/UpdatePassword";
import StoreDetails from "./pages/StoreDetails";
import { ProtectedRoute } from "./utils/auth.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <Navbar />
        <div className="container mx-auto p-4 bg-zinc-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute role="admin">
                  <ListUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute role="admin">
                  <ListStores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store-owner"
              element={
                <ProtectedRoute role="store_owner">
                  <StoreOwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/stores"
              element={
                <ProtectedRoute role="user">
                  <UserStores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/:id"
              element={
                <ProtectedRoute role="user">
                  <StoreDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update-password"
              element={
                <ProtectedRoute>
                  <UpdatePassword />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
