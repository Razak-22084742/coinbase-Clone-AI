// pages/Explore.jsx — Browse all cryptocurrencies from the backend
//
// Fetches from GET /api/crypto and displays coins in a grid.
// Replaces the old hardcoded sampleAssets array with live MongoDB data.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import Footer from "../components/layout/Footer";
import NavBar from "../components/layout/NavBar";

const Explore = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // GET /api/crypto — returns all coins from MongoDB, newest first
        const response = await api.get("/crypto");
        setAssets(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load cryptocurrencies. Is the backend running?"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  /**
   * Format backend data for display.
   * Backend shape: { _id, name, symbol, price (Number), change24h (Number), image, createdAt }
   * Display shape: { id, name, symbol, price (string "$1,234"), change (string "+2.50%") }
   */
  const formattedAssets = assets.map((a) => ({
    id: a._id,
    name: a.name,
    symbol: a.symbol,
    image: a.image || "",
    price: `$${Number(a.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`,
    change:
      a.change24h >= 0
        ? `+${Number(a.change24h).toFixed(2)}%`
        : `${Number(a.change24h).toFixed(2)}%`,
    isPositive: a.change24h >= 0,
  }));

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header>
        <NavBar />
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold">Explore</h1>
            <p className="text-gray-600 mt-2">
              Browse cryptocurrencies in the database.
            </p>
          </div>
          {/* Link to the Add Crypto page */}
          <Link
            to="/add-crypto"
            className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shrink-0"
          >
            + Add Cryptocurrency
          </Link>
        </div>

        {/* Search / Filters — visual only */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="w-full sm:w-2/3">
            <label htmlFor="explore-search" className="sr-only">
              Search assets
            </label>
            <div className="relative">
              <input
                id="explore-search"
                type="search"
                placeholder="Search assets, e.g. Bitcoin, ETH, SOL"
                className="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          <div className="w-full sm:w-1/3 flex justify-end">
            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
              >
                All markets
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Price
              </button>
            </div>
          </div>
        </div>

        {/* Asset list / grid */}
        <section aria-labelledby="explore-assets">
          <h2 id="explore-assets" className="sr-only">
            Assets
          </h2>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-16 text-gray-500 text-sm">
              Loading cryptocurrencies...
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          {/* Empty state — shown when backend has no coins yet */}
          {!loading && !error && formattedAssets.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm mb-4">
                No cryptocurrencies added yet. Be the first to add one!
              </p>
              <Link
                to="/add-crypto"
                className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Add your first cryptocurrency
              </Link>
            </div>
          )}

          {/* Coins grid — same card layout as before, just driven by backend data */}
          {formattedAssets.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formattedAssets.map((a) => (
                <a
                  key={a.id}
                  href={`/asset/${a.id}`}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow bg-white"
                >
                  {/* Coin avatar — shows image if available, otherwise first letter of symbol */}
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {a.image ? (
                      <img
                        src={a.image}
                        alt={a.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          // If image fails to load, show the letter fallback
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextSibling.style.display = "block";
                        }}
                      />
                    ) : null}
                    <span
                      className="text-sm font-bold text-gray-700"
                      style={{ display: a.image ? "none" : "block" }}
                    >
                      {a.symbol[0]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{a.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{a.symbol}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-medium text-sm">{a.price}</p>
                        <p className={`text-xs mt-1 ${a.isPositive ? "text-green-600" : "text-red-600"}`}>
                          {a.change}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
