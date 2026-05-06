// pages/Profile.jsx — Protected user profile page
//
// This page is only accessible when logged in.
// The ProtectedRoute in App.jsx redirects unauthenticated users to /signin.
// Fetches profile data from GET /api/profile using the stored JWT token.

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // GET /api/profile — the JWT token is attached automatically by the
        // request interceptor in src/lib/api.js
        const response = await api.get("/profile");
        setProfile(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout(); // Clears token and user from localStorage + context
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Your Profile</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Logged in as {user?.email}
        </p>

        {/* Loading state */}
        {loading && (
          <div className="text-gray-500 text-sm py-8 text-center">
            Loading profile...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Profile data */}
        {profile && (
          <div className="space-y-4">
            {/* Name card */}
            <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Name
              </p>
              <p className="text-xl font-semibold text-gray-900">{profile.name}</p>
            </div>

            {/* Email card */}
            <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Email
              </p>
              <p className="text-xl font-semibold text-gray-900">{profile.email}</p>
            </div>

            {/* Quick links */}
            <div className="flex gap-3 pt-4">
              <Link
                to="/explore"
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Browse Crypto
              </Link>
              <Link
                to="/add-crypto"
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Add Cryptocurrency
              </Link>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full mt-4 py-3 px-4 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-semibold transition-colors text-sm"
            >
              Log out
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
