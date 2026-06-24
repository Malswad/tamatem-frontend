"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiGet } from "../../lib/api";

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login"); // not logged in → bounce to login
      return;
    }
    apiGet("api/products")
      .then((data) => setGames(data))
      .catch(() => router.push("/login"));
  }, []);

return (
  <div className="page">
    <h1 className="title">Game<span>Store</span></h1>

    {/* This container activates the 3-column grid layout */}
    <div className="games-grid">
      {games.map((game) => (
        <Link key={game.id} href={`/games/${game.id}`} className="card card-link">

          {/* Top row of the card: Title */}
          <div className="row" style={{ alignItems: 'flex-start', marginBottom: '16px' }}>
            <strong style={{ fontSize: '18px', lineHeight: '1.4' }}>{game.title}</strong>
          </div>

          {/* Bottom row of the card: Location and Price pushed down */}
          <div className="row" style={{ marginTop: 'auto', gap: '8px' }}>
            <span className="muted" style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
              📍 {game.location}
            </span>
            <span className="price">${game.price}</span>
          </div>

          {/* Optional: Genre tag displays underneath if it exists */}
          {game.genre && (
            <div style={{ marginTop: '8px' }}>
              <span className="tag">{game.genre}</span>
            </div>
          )}

        </Link>
      ))}
    </div>
  </div>
);


}