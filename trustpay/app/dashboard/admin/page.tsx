"use client";

import { useEffect, useState } from "react";
import "./dashboard_admin.css";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// create type for transaction
type Transaction = {
  id: string;
  toName: string;
  toPhone: string;
  amount: number;
  status: "NORMAL" | "SUSPICIOUS" | "FLAGGED";
  risk_score?: number;
  reason?: string;
  confidence?: number;
  admin_suggestion?: string;
};

// admin dashboard page
export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch transactions that are suspicious or flagged
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // query for transactions that are suspicious or flagged
        const q = query(
          collection(db, "transactions"),
          where("status", "in", ["SUSPICIOUS", "FLAGGED"])
        );

        // get transactions that are suspicious or flagged
        const snapshot = await getDocs(q);

        // map transactions to type
        const data: Transaction[] = snapshot.docs.map((docSnap) => {
          const docData = docSnap.data();

          // return transaction data
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

        // set transactions state
        setTransactions(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // approve transaction
  const handleApprove = async (id: string) => {
    try {
      // update transaction status to normal
      await updateDoc(doc(db, "transactions", id), {
        status: "NORMAL",
      });

      // update transactions state
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  // reject transaction
  const handleReject = async (id: string) => {
    try {
      await updateDoc(doc(db, "transactions", id), {
        status: "FLAGGED",
      });

      // update transactions state
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  // admin dashboard
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

            {tx.status === "FLAGGED" && (
              <p className="text-red-600 font-semibold mt-2">
                🚫 This account is flagged as fraudulent. No actions available.
              </p>
            )}

            {tx.status === "SUSPICIOUS" && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleApprove(tx.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

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
};