// lib/api.ts
const BASE_URL = "http://127.0.0.1:8000/"; // ← replace with your real API base URL

// reads the saved login token from the browser
function getToken() {
  return localStorage.getItem("token");
}

export async function apiGet(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export async function apiPost(path: string, body: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}