"use client"
import Link from "next/link";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (e: any) => {
  e.preventDefault();

  const form = e.currentTarget;

  const email = form.email.value;
  const password = form.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/dashboard/user");
  } catch (error) {
    alert("Fail to login");
  }
};


  const [showPassword, setShowPassword] = useState(false);

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
          
          <h1 className="title">WELCOME</h1>
          <p className="subtitle">Login with your details.</p>

          <form className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium block">
              Email
            </label>

            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="input-field"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                  Remember me
              </label>
            </div>

            <label htmlFor="password" className="text-sm font-medium block">
              Password
            </label>
            <div className="password">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
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
                Login
            </button>
          </form>

          <p className="text-bottom">
            Don't have an account?{" "}
            <Link href="/" className="text-blue-500 hover:underline">
              Sign up page
            </Link>
          </p>

        </div>
     </div>

    </div>
  );
}