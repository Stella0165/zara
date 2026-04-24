"use client";

import Link from "next/link";

// landing page
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-6 text-center">

      {/* Welcome title */}
      <h1 className="text-4xl font-bold text-gray-800">
        Welcome to TrustPay
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 mt-4 max-w-xl">
        An AI-powered payment system that helps avoids scam during transaction.
      </p>

      {/* buttons */}
      <div className="flex gap-4 mt-8">

        <Link href="/signup">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Create an account
          </button>
        </Link>

        <Link href="/login/user">
          <button className="px-6 py-3 border border-gray-400 rounded-lg hover:bg-gray-100 transition">
            Login
          </button>
        </Link>

      </div>

      {/* admin page link */}
      <div className="mt-10 text-sm text-gray-500">
        Are you an admin?{" "}
        <Link href="/login/admin" className="text-blue-500 hover:underline">
          Admin Page
        </Link>
      </div>

    </div>
  );
}