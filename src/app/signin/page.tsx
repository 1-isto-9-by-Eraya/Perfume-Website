// app/signin/page.tsx
"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-actions";

export default function SignInPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(formData: FormData) {
    setLoading(true);
    setError("");
    
    try {
      const result = await signIn(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(formData: FormData) {
    setLoading(true);
    setError("");
    
    try {
      const result = await signUp(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Sign in to your account
          </h2>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        <form action={handleSignIn} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB9C1C] focus:border-transparent disabled:opacity-50"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={loading}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB9C1C] focus:border-transparent disabled:opacity-50"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#EB9C1C] hover:bg-[#d18a1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB9C1C] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Sign Up Form */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">
                Or create new account
              </span>
            </div>
          </div>

          <form action={handleSignUp} className="mt-6 space-y-4">
            <div>
              <input
                name="name"
                type="text"
                required
                disabled={loading}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB9C1C] focus:border-transparent disabled:opacity-50"
                placeholder="Full name"
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                disabled={loading}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB9C1C] focus:border-transparent disabled:opacity-50"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                disabled={loading}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB9C1C] focus:border-transparent disabled:opacity-50"
                placeholder="Password (min 6 characters)"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB9C1C] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}