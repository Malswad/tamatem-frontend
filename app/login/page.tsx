"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://127.0.0.1:8000/"; // same base as in lib/api.ts

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin() {
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      localStorage.setItem("token", data.token); // ← save the token the API returns
      router.push("/games"); // ← go to the games list
    } catch (e) {
      setError("Login failed. Check your username and password.");
    }
  }

    return (
        <div className="page page-narrow">
          <h1 className="title">Game<span>Store</span></h1>
          <input className="input" placeholder="Username"
            value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="input" type="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn btn-primary" onClick={handleLogin}>Log in</button>
          {error && <p className="error">{error}</p>}
        </div>
      );
}