// pages/AddCrypto.jsx — Add a new cryptocurrency to the database
//
// Submits a POST /api/crypto request with the form data.
// On success, redirects to /explore so the user can see the new entry.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

export default function AddCrypto() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    price: "",
    image: "",
    change24h: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Single handler for all fields — keeps form code concise
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formData.name || !formData.symbol || !formData.price) {
      setError("Name, symbol, and price are required.");
      return;
    }
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      setError("Price must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      // POST /api/crypto — add to MongoDB
      await api.post("/crypto", {
        name: formData.name.trim(),
        symbol: formData.symbol.trim().toUpperCase(), // e.g. "btc" → "BTC"
        price: parseFloat(formData.price),
        image: formData.image.trim() || "",
        change24h: parseFloat(formData.change24h) || 0,
      });

      setSuccess(true);

      // Redirect to explore page after 1.5 seconds so the user can see the success message
      setTimeout(() => navigate("/explore"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add cryptocurrency. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Shared input class for consistent styling
  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-gray-900 placeholder-gray-400 bg-white disabled:bg-gray-50";

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-12">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add a Cryptocurrency
          </h1>
          <p className="text-gray-500 text-sm">
            Add a new coin to the database. It will appear on the{" "}
            <Link to="/explore" className="text-blue-600 hover:underline">
              Explore
            </Link>{" "}
            page.
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 text-sm font-medium">
            Cryptocurrency added successfully! Redirecting to Explore...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Bitcoin"
              required
              disabled={loading || success}
              className={inputClass}
            />
          </div>

          {/* Symbol */}
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-2">
              Symbol <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="e.g. BTC"
              required
              disabled={loading || success}
              className={inputClass}
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (USD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 45000"
              min="0"
              step="any"
              required
              disabled={loading || success}
              className={inputClass}
            />
          </div>

          {/* 24h Change */}
          <div>
            <label htmlFor="change24h" className="block text-sm font-medium text-gray-700 mb-2">
              24h Change (%) — optional
            </label>
            <input
              type="number"
              id="change24h"
              name="change24h"
              value={formData.change24h}
              onChange={handleChange}
              placeholder="e.g. 2.5 for +2.5%, -1.3 for -1.3%"
              step="any"
              disabled={loading || success}
              className={inputClass}
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL — optional
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/coin-logo.png"
              disabled={loading || success}
              className={inputClass}
            />
          </div>

          {/* Error message */}
          {error && (
            <div role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {loading ? "Adding..." : "Add Cryptocurrency"}
          </button>

          {/* Cancel link */}
          <div className="text-center">
            <Link
              to="/explore"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel — go back to Explore
            </Link>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
