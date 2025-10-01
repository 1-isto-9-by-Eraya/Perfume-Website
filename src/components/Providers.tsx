"use client";
import { SessionProvider } from "next-auth/react";
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider basePath="/1isto9-perfumery/api/auth">{children}</SessionProvider>;
}

