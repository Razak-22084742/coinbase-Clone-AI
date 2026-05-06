// CryptoList.jsx — Renders a list of coins using data from useCryptos hook
// Data shape (normalised by useCrypto.js):
//   { id, name, symbol, image, current_price, price_change_percentage_24h }

import { useCryptos } from "../../hooks/useCrypto";

export default function CryptoList({ type }) {
  const { cryptos, loading, error } = useCryptos(type);

  if (loading) return <div className="text-gray-400 py-8 text-center">Loading...</div>;
  if (error) return <div className="text-red-400 py-8 text-center">{error}</div>;
  if (cryptos.length === 0) {
    return (
      <div className="text-gray-400 py-8 text-center text-sm">
        No cryptocurrencies found. Run the seed script to add sample data.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {cryptos.map((crypto) => {
        const price = crypto.current_price || 0;
        const change = crypto.price_change_percentage_24h || 0;

        return (
          <div
            key={crypto.id}
            className="flex items-center justify-between py-4 px-4 hover:bg-gray-900 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {/* Avatar: image with letter fallback */}
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                {crypto.image ? (
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <span className="text-xs font-bold text-white">
                    {(crypto.symbol || "?")[0]}
                  </span>
                )}
              </div>

              <div>
                <p className="text-white font-semibold">{crypto.name}</p>
                <p className="text-gray-400 text-sm">{crypto.symbol}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-white font-semibold">
                ${Number(price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
                })}
              </p>
              <p
                className={`text-sm font-semibold ${
                  change >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {change >= 0 ? "📈" : "📉"} {Math.abs(change).toFixed(2)}%
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
