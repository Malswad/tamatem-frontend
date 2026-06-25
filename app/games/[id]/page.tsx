"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPost } from "../../../lib/api";
import { useAuth } from "../../context/AuthContext"; // <-- import

export default function GameDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, logout } = useAuth(); // <-- get token + logout
  const [game, setGame] = useState<any>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    // Guard: if no token, redirect to login
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch game details
    apiGet(`api/products/${id}`)
      .then((data) => setGame(data))
      .catch(() => {
        // On error (e.g., 401), log out and redirect
        logout();
        router.push("/login");
      });
  }, [id, token, logout, router]);

  async function handleBuy() {
    setBuying(true);
    try {
      const response = await apiPost("api/purchase/", {
        product_id: id,
        quantity: 1,
      });
      router.push(`/receipt/${response.receipt.id}`);
    } catch (e) {
      setBuying(false);
      // If it's an auth error, logout; otherwise just show an alert
      // For simplicity, logout on any failure
      logout();
      router.push("/login");
    }
  }

  if (!game) return <div className="page"><p className="muted">Loading…</p></div>;

  return (
    <div className="page">
      <div className="card stack">
        <h1 className="title" style={{ marginBottom: 4 }}>{game.title}</h1>
        {game.description && <span className="tag">{game.description}</span>}
        <p className="muted">{game.location}</p>
        <p className="price" style={{ fontSize: 22 }}>${game.price}</p>
        <button className="btn btn-primary" onClick={handleBuy} disabled={buying}>
          {buying ? "Processing…" : "Buy now"}
        </button>
      </div>
    </div>
  );
}