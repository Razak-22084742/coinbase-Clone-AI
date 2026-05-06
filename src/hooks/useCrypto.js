// hooks/useCrypto.js — Fetches crypto data from our own backend (not CoinGecko)
//
// type:  "tradable" → GET /api/crypto         (all coins, newest first)
//        "gainers"  → GET /api/crypto/gainers  (top 6 by 24h % change)
//        "new"      → GET /api/crypto/new       (6 most recently added)

import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useCryptos(type) {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        let endpoint = "/crypto";
        if (type === "gainers") endpoint = "/crypto/gainers";
        else if (type === "new") endpoint = "/crypto/new";

        const response = await api.get(endpoint);

        // Normalise backend shape → consistent display shape used by CryptoList
        // Backend: { _id, name, symbol, price, change24h, image, createdAt }
        const normalized = (response.data || []).map((c) => ({
          id: c._id,
          name: c.name,
          symbol: c.symbol,
          image: c.image || "",
          current_price: c.price,
          price_change_percentage_24h: c.change24h,
        }));

        setCryptos(normalized);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
        setCryptos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, [type]);

  return { cryptos, loading, error };
}
