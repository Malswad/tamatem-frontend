"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPost } from "../../../lib/api";

export default function GameDetailPage() {
  const { id } = useParams(); // grabs the [id] from the URL
  const router = useRouter();
  const [game, setGame] = useState<any>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    apiGet(`/games/${id}`).then((data) => setGame(data));
  }, [id]);

  async function handleBuy() {
    setBuying(true);
    try {
      const receipt = await apiPost("/transactions", { gameId: id });
      router.push(`/receipt/${receipt.id}`); // go to the receipt page
    } catch (e) {
      setBuying(false);
      alert("Purchase failed.");
    }
  }

  if (!game) return <div className="page"><p className="muted">Loading…</p></div>;

  return (
    <div className="page page-narrow">
      <div className="card stack">
        <h1 className="title" style={{ marginBottom: 4 }}>{game.name}</h1>
        {game.genre && <span className="tag">{game.genre}</span>}
        <p className="muted">{game.description}</p>
        <p className="price" style={{ fontSize: 22 }}>${game.price}</p>
        <button className="btn btn-primary" onClick={handleBuy} disabled={buying}>
          {buying ? "Processing…" : "Buy now"}
        </button>
      </div>
    </div>
  );
}