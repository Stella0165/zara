"use client"

import Link from "next/link";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const handleSignup = async (e: any) => {
    e.preventDefault();

    const form = e.currentTarget;

    const email = form.email.value;
    const password = form.password.value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created!");
    } catch (error) {
      alert("Fail to create account");
    }
  };

  return (
    <div className="page-container">

      <div className="image-section">
        <img
          src="/title.png"
          alt="signup illustration"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="form-right">
        <div className="form">
          
          <h1 className="title">SIGN UP PAGE</h1>
          <p className="subtitle">Fill in registration details.</p>

          <form className="flex flex-col gap-2" onSubmit={handleSignup}>
            <label htmlFor="email" className="text-sm font-medium block">
              Email
            </label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="Enter email address"
              className="input-field"
            />

            {/* Password */}
            <label htmlFor="password" className="text-sm font-medium block">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter password"
                className="input-field"
            />
            <button
                type="button"
                className="absolute right-2 top-1/3 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>

            <button type="submit" className="btn-primary">
              Sign up
            </button>
          </form>

          <p className="text-bottom">
            Already have an account?{" "}
            <Link href="/login/user" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>

        </div>
     </div>

    </div>
  );
}