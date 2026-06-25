"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiGet } from "../../lib/api";
import { useAuth } from "../context/AuthContext";

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [locations, setLocations] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { token, logout } = useAuth();

  const fetchGames = useCallback(
    async (pageNum: number, location: string) => {
      setLoading(true);
      setError(null);
      try {
        if (!token) {
          router.push("/login");
          return;
        }

        let url = `api/products/?page=${pageNum}`;
        if (location !== "all") {
          url += `&location=${location}`;
        }

        const data = await apiGet(url);

        setGames(data.results);
        setTotalPages(Math.ceil(data.count / 9));

        // Extract unique locations only once, from the first page of results.
        // If the first page is empty, this won't populate locations – consider a dedicated endpoint.
        if (locations.length === 0 && data.results.length > 0) {
          const uniqueLocations = Array.from(
            new Set(data.results.map((g: any) => g.location).filter(Boolean))
          );
          setLocations(uniqueLocations);
        }
      } catch (err: any) {
        // Only treat 401 as an authentication error; other errors show a message.
        if (err?.response?.status === 401 || err?.status === 401) {
          logout();
          router.push("/login");
        } else {
          setError("Failed to load games. Please try again later.");
          console.error("Fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    },
    [token, logout, router, locations.length]
  );

  // Reset page when location changes (already done in handleLocationChange, but kept for safety)
  useEffect(() => {
    fetchGames(page, selectedLocation);
  }, [page, selectedLocation, fetchGames]);

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setPage(1);
  };

  return (
    <div className="page">
      <h1 className="title">
        Game<span>Store</span>
      </h1>

      <div className="filter-section">
        <label htmlFor="location-filter" className="filter-label">
          Filter by Location:
        </label>
        <select
          id="location-filter"
          className="filter-select"
          value={selectedLocation}
          onChange={(e) => handleLocationChange(e.target.value)}
        >
          <option value="all">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="games-grid">
        {games.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`} className="card card-link">
            <div className="row" style={{ alignItems: "flex-start", marginBottom: "16px" }}>
              <strong style={{ fontSize: "18px", lineHeight: "1.4" }}>{game.title}</strong>
            </div>
            <div className="row" style={{ marginTop: "auto", gap: "8px" }}>
              <span className="muted" style={{ fontSize: "14px", display: "flex", alignItems: "center" }}>
                📍 {game.location}
              </span>
              <span className="price">${game.price}</span>
            </div>
            {game.genre && (
              <div style={{ marginTop: "8px" }}>
                <span className="tag">{game.genre}</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {games.length === 0 && !loading && !error && (
        <p className="no-games-message">No games available at this location.</p>
      )}

      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}