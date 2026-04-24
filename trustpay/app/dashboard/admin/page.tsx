"use client";

import { useEffect, useState } from "react";
import "./dashboard_admin.css";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Transaction = {
  id: string;
  toName: string;
  toPhone: string;
  amount: number;
  status: "NORMAL" | "SUSPICIOUS" | "FRAUD";
  risk_score?: number;
  reason?: string;
  confidence?: number;
  admin_suggestion?: string;
};

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const q = query(
          collection(db, "transactions"),
          where("status", "in", ["SUSPICIOUS", "FLAGGED"])
        );

        const snapshot = await getDocs(q);

        const data: Transaction[] = snapshot.docs.map((docSnap) => {
          const docData = docSnap.data();

          return {
            id: docSnap.id,
            toName: docData.toName,
            toPhone: docData.toPhone,
            amount: docData.amount,
            status: docData.status,
            reason: docData.reason,
            confidence: docData.confidence,
          };
        })

        setTransactions(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "transactions", id), {
        status: "NORMAL",
      });

      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDoc(doc(db, "transactions", id), {
        status: "FLAGGED",
      });

      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  return (
    <div className="dashboard-admin">
      <h1 className="dashboard-title">Admin Review Panel</h1>

      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">No suspicious transactions found</p>
      ) : (
        <div className="transaction-list">
          {transactions.map((tx) => (
            <div key={tx.id} className="border p-4 rounded">
              <p><strong>To:</strong> {tx.toName}</p>
              <p><strong>Phone:</strong> {tx.toPhone}</p>
              <p><strong>Amount:</strong> RM {tx.amount}</p>

              <p className="text-orange-500 font-semibold">
                {tx.status}
              </p>

              {tx.status !== "FRAUD" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleApprove(tx.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>

                  {tx.status === "NORMAL" && (
                    <p className="text-sm text-gray-500 mt-1">
                      Your transaction number has been sent to email, please check.
                    </p>
                  )}

                  <button
                    onClick={() => handleReject(tx.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Flagged
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}