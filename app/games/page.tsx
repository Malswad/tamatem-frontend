"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiGet } from "../../lib/api";

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [filteredGames, setFilteredGames] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [locations, setLocations] = useState<string[]>([]);

  // Pagination - just these 3 states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Fetch games with pagination
  const fetchGames = async (pageNum: number, location: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Build URL with pagination params
      let url = `api/products/?page=${pageNum}`;
      if (location !== "all") {
        url += `&location=${location}`;
      }

      const data = await apiGet(url);

      // Handle paginated response
      if (data.results) {
        setGames(data.results);
        setFilteredGames(data.results);
        setTotalPages(Math.ceil(data.count / 9));

        // Get locations (only once)
        if (locations.length === 0) {
          const uniqueLocations = Array.from(
            new Set(data.results.map((g: any) => g.location).filter(Boolean))
          );
          setLocations(uniqueLocations);
        }
      }
    } catch (error) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // Initial load and filter changes
  useEffect(() => {
    fetchGames(page, selectedLocation);
  }, [page, selectedLocation]);

  // Handle location filter change
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="page">
      <h1 className="title">Game<span>Store</span></h1>

      {/* Filter Section */}
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

      {/* Loading state */}
      {loading && <p>Loading...</p>}

      {/* Games Grid */}
      <div className="games-grid">
        {filteredGames.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`} className="card card-link">
            <div className="row" style={{ alignItems: 'flex-start', marginBottom: '16px' }}>
              <strong style={{ fontSize: '18px', lineHeight: '1.4' }}>{game.title}</strong>
            </div>

            <div className="row" style={{ marginTop: 'auto', gap: '8px' }}>
              <span className="muted" style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                📍 {game.location}
              </span>
              <span className="price">${game.price}</span>
            </div>

            {game.genre && (
              <div style={{ marginTop: '8px' }}>
                <span className="tag">{game.genre}</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {filteredGames.length === 0 && !loading && (
        <p className="no-games-message">No games available at this location.</p>
      )}

      {/* Simple Pagination - Just Previous/Next buttons */}
      {totalPages > 1 && (
  <div className="pagination-container">
    <button
      className="pagination-btn"
      onClick={() => setPage(p => Math.max(1, p - 1))}
      disabled={page === 1}
    >
      ← Previous
    </button>

    <span className="pagination-info">
      Page {page} of {totalPages}
    </span>

    <button
      className="pagination-btn"
      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
      disabled={page === totalPages}
    >
      Next →
    </button>
  </div>
)}
    </div>
  );
}