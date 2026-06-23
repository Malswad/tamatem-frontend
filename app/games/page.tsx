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
      <div className="stack">
        {games.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`} className="card card-link">
            <div className="row">
              <strong>{game.name}</strong>
              <span className="price">${game.price}</span>
            </div>
            {game.genre && <span className="tag">{game.genre}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}