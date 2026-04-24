// app/dashboard/user/page.tsx
// Dashboard for user to make transactions

"use client";

import { useState, useEffect } from "react";
import "./dashboard_user.css";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";

// define the structure of a transaction
type Transaction = {
  id: string,
  toName: string;
  toPhone: string;
  amount: number;
  status: "NORMAL" | "SUSPICIOUS" | "FLAGGED";
};

// define the function for the user dashboard
export default function UserDashboard() {

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [amount, setAmount] = useState("");

  // create a state for transaction
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      // get the current user
      const user = getAuth().currentUser;
      if (!user) return;

      // query for transactions that are normal, suspicious or flagged
      try {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        // convert to type transaction
        const data: Transaction[] = snapshot.docs.map((docSnap) => {
        //  get the document data
        const docData = docSnap.data();

        // push data to type transaction
        return {
          id: docSnap.id,
          toName: docData.toName,
          toPhone: docData.toPhone,
          amount: docData.amount,
          status: docData.status,
        };
      });

      // update transactions
      setTransactions(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchTransactions();
  }, []);

  // submit transaction
  const handleSubmit = async () => {

    // get the current user
    const user = getAuth().currentUser;

    // if user is null, return
    if (!user) return;

    console.log("Button 'transfer' clicked");
    // validation for no input
    if (!toName.trim() || !toPhone.trim() || !amount.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    // remove white spaces and check length
    if (toPhone.replace(/\s/g, "").length < 9) {
      alert("Phone number format wrong.")
      return;
    }

    if (Number(amount) <= 0) {
      alert("Transfer amount couldn't be zero.")
      return;
    }

    // try submit transaction
    try {
      setShowForm(false);
      setLoading(true);
      setLoadingMessage("Processing transaction...");

      // pause for 0.4 sec
      await new Promise((r) => setTimeout(r, 400));

      setLoadingMessage("AI is analyzing transaction risk...");

      // send to api transfer
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toName,
          toPhone,
          amount: Number(amount),
        }),
      });

      const result = await res.json();

      setLoading(false);
      setLoadingMessage("");

      // if api error, alert
      if (!res.ok) {
        console.error("API ERROR:", result);
        alert(result.error || "Server error occurred");
        return;
      }

      console.log("RESULT:", result);

      // if flagged, alert
      if (result.blocked === true) {
        alert("Transaction rejected: recipient is flagged before.");
        return;
      }

      const status =
        result.status === "NORMAL"
          ? "NORMAL"
          : result.status === "FLAGGED"
            ? "SUSPICIOUS"
            : result.status === "rejected"
              ? "FLAGGED"
              : "SUSPICIOUS";

      if (status === "FLAGGED") {
        alert("Flagged account detected");
      }

      // if suspicious, save to db
      if (status === "SUSPICIOUS") {
        await addDoc(collection(db, "transactions"), {
          userId: user.uid,
          toName,
          toPhone,
          amount: Number(amount),
          status,

          reason: result.reason ?? "No reason provided",
          action: result.action ?? "ON HOLD",
          confidence: result.confidence ?? 100,

          createdAt: serverTimestamp(),
        });
        alert("Suspicious transaction detected, this transaction has been sent to admin for validation, we'll send transaction number to you through email once validation completed.");
      }

      // if normal, alert
      if (status === "NORMAL") {
        alert("Validation successfil. Your transaction number has been sent to email, please check.");
      }

      setToName("");
      setToPhone("");
      setAmount("");

    } catch (error) {
      console.error("ERROR:", error);
      setLoading(false);
      setLoadingMessage("");
      alert("Error occurred");
    }
  };

  return (
    <div className="dashboard-user">

      <h1 className="dashboard-title">
        TrustPay Transaction View
      </h1>

      <button
        onClick={() => setShowForm(true)}
        className="btn-primary"
      >
        + Add New Transaction
      </button>

      {/* No transaction made before */}
      {transactions.length === 0 ? (
        <p className="text-gray-500">
          No transaction record found.
        </p>

      ) : (
        <div className="transaction-list">

          {transactions.map((tx) => (
            <div key={tx.id} className="border p-4 rounded">
              <p>To: {tx.toName}</p>
              <p>Phone: {tx.toPhone}</p>
              <p>Amount: RM {tx.amount}</p>

              <p
                className={
                  tx.status === "FLAGGED"
                    ? "text-red-600"
                    : tx.status === "SUSPICIOUS"
                      ? "text-orange-500"
                      : "text-green-600"
                }
              >
                {tx.status}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* transaction request form */}
      {showForm && (
        <div className="modal-bg">
          <div className="modal-box">

            <h2 className="text-xl font-bold mb-4">
              New Transaction
            </h2>

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-black-600 hover:text-black text-xl"
            >
              x
            </button>

            <input
              className="input"
              placeholder="Recipient Name"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
            />

            <input
              className="input"
              placeholder="Phone Number"
              value={toPhone}
              onChange={(e) => setToPhone(e.target.value)}
            />

            <input
              className="input"
              placeholder="Amount($)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              type="button"
              onClick={() => {
                console.log("BUTTON PRESSED");
                handleSubmit();
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded"

            >
              Transfer
            </button>

            {loading && (
              <div className="p-3 bg-blue-100 text-blue-700 rounded mb-4">
                {loadingMessage}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}