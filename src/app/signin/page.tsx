// app/signin/page.tsx
"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#222] p-6 rounded-lg border border-gray-700 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-gray-300">
          Only approved emails can sign in. If your email isn’t whitelisted,
          you’ll remain a public viewer.
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-6 w-full rounded-md px-4 py-2 bg-white text-black hover:bg-gray-100"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
