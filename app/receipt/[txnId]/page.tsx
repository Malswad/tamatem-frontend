"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiGet } from "../../../lib/api";
import { useAuth } from "../../context/AuthContext"; // <-- import
import { useRouter } from "next/navigation"; // <-- import router for redirect

export default function ReceiptPage() {
  const { txnId } = useParams();
  const router = useRouter();
  const { token, logout } = useAuth();
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    // Guard: if no token, redirect to login
    if (!token) {
      router.push("/login");
      return;
    }

    apiGet(`api/purchase/${txnId}/`)
      .then((data) => setReceipt(data))
      .catch(() => {
        logout();
        router.push("/login");
      });
  }, [txnId, token, logout, router]);

  if (!receipt) return <div className="page"><p className="muted">Loading receipt…</p></div>;

  return (
    <div className="page">
      <div className="receipt-card">
        <span className="badge-success">✓ Purchase complete</span>
        <h1 className="title" style={{ marginBottom: 4 }}>Receipt</h1>
        <p className="muted">Transaction #{receipt.id}</p>
        <div className="row">
          <span>{receipt.product_title}</span>
          <span className="price">${receipt.total_amount}</span>
        </div>
        <p className="muted">
          {new Date(receipt.created_at).toLocaleString()}
        </p>
        <Link href="/games" className="btn btn-primary">
          Back to games
        </Link>
      </div>
    </div>
  );
}