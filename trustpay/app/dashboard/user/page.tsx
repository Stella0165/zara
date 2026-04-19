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

  const [showForm, setShowForm] = useState(false);

  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [amount, setAmount] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleSubmit = async () => {
    try {
      console.log("Transfer clicked"); 
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toName,
          toPhone,
          amount: Number(amount),
        }),
      });
      
      if (!res.ok) {
      console.error("Error:", res.status);
      alert("Transaction failed");
      return;
    };

    const result = await res.json();

    let status = result.status

    if (status === "FLAGGED") {
      alert("Transaction rejected: This transaction account was flagged and not allowed to transfer."); 
      setShowForm(false);
      return;
    }

    if (status === "SUSPICIOUS") {
      alert("Transaction suspicious: Waiting admin to validate");
    }

    if (status === "NORMAL") {
      alert("Transaction Completed.");
    }

    // Save transaction
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

    // Reset the form
    setShowForm(false);
    setToName("");
    setToPhone("");
    setAmount("");
  } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong");
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
                  console.log("TRANSFER BUTTON CLICKED");
                  handleSubmit();
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Transfer
              </button>
            </div>
          </div>
      )}
      
    </div>
  );
}