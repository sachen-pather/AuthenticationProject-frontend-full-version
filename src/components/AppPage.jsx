"use client";

import { useAuth } from "../AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = "https://api.coingecko.com/api/v3";

async function getTopCryptos(count = 3) {
  const response = await fetch(
    `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch top cryptos");
  }
  return response.json();
}

async function getCryptoHistory(id) {
  const response = await fetch(
    `${API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch crypto history");
  }
  const data = await response.json();
  return data.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price,
  }));
}

const AppPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem("isAuthenticated");
      if (!storedAuth) {
        setIsAuthenticated(false);
        navigate("/");
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate, setIsAuthenticated]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOGIN_DATABASE}/Account/logout`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BEARER_LOGIN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("isAuthenticated");
        setIsAuthenticated(false);
        navigate("/");
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  const fetchCryptoData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const topCryptos = await getTopCryptos(3);
      setCryptos(topCryptos);
      if (topCryptos.length > 0) {
        setSelectedCrypto(topCryptos[0]);
      }
    } catch (error) {
      console.error("Error fetching top cryptos:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchCryptoData();
    }
  }, [fetchCryptoData, isAuthenticated, loading]);

  useEffect(() => {
    async function fetchHistory() {
      if (selectedCrypto) {
        try {
          const history = await getCryptoHistory(selectedCrypto.id);
          setPriceHistory(history);
        } catch (error) {
          console.error("Error fetching price history:", error);
        }
      }
    }
    fetchHistory();
  }, [selectedCrypto]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-4">
        <h2 className="text-lg font-semibold mb-4">Menu</h2>
        <nav className="space-y-2">
          <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-700">
            Dashboard
          </button>
          <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-700">
            Markets
          </button>
          <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-700">
            Watchlist
          </button>
        </nav>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="h-16 flex items-center justify-between px-4">
            <div>
              <h1 className="text-2xl font-bold">
                Old Data no longer available for battery system, Instead observe
                this crypto data
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {cryptos.map((crypto) => (
              <div
                key={crypto.id}
                className={`bg-gray-800 p-4 rounded-lg cursor-pointer ${
                  selectedCrypto?.id === crypto.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedCrypto(crypto)}
              >
                <h3 className="text-lg font-semibold mb-2">
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </h3>
                <p className="text-2xl font-bold">
                  ${crypto.current_price.toLocaleString()}
                </p>
                <p
                  className={`text-sm ${
                    crypto.price_change_percentage_24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
          {selectedCrypto && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                {selectedCrypto.name} Price History (30 Days)
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                      }}
                      labelStyle={{ color: "#D1D5DB" }}
                      itemStyle={{ color: "#D1D5DB" }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#3B82F6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AppPage;
