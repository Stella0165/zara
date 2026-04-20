"use client";

import { useState } from "react";
import "./dashboard_user.css";

type Transaction = {
  id: number,
  toName: string;
  toPhone: string;
  amount: number;
  status: "NORMAL" | "SUSPICIOUS" | "FLAGGED";
};

export default function UserDashboard() {

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [amount, setAmount] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleSubmit = async () => {

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

    try {

      setShowForm(false);
      setLoading(true);
      setLoadingMessage("Processing transaction...");

      await new Promise((r) => setTimeout(r, 400));

      setLoadingMessage("AI is analyzing transaction risk...");
    
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

      if (!res.ok) {
        console.error("API ERROR:", result);
        alert(result.error || "Server error occurred");
        return;
      }

      console.log("RESULT:", result);

      const status =
        result.status === "approved"
          ? "NORMAL"
          : result.status === "pending"
          ? "SUSPICIOUS"
          : result.status === "rejected"
          ? "FLAGGED"
          : "SUSPICIOUS";

      setTransactions((prev) => [
        {
          id: Date.now(),
          toName,
          toPhone,
          amount: Number(amount),
          status,
        },
        ...prev,
      ]);

      if (status === "FLAGGED") {
        alert("Flagged account detected");
      }

      if (status === "SUSPICIOUS") {
        alert("Suspicious transaction detected, this transaction has been sent to admin for validation, we'll notify you once the validation completed.");
      }

      if (status === "NORMAL") {
        alert("Transaction Completed");
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

        {/* form */}
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
                    handleSubmit();}}
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