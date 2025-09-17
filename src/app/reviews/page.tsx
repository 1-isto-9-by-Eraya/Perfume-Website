// src/app/reviews/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isReviewer } from "@/lib/roles";
import PendingPostsList from "@/components/reviews/PendingPostsList";
import type { ExtendedSession } from "@/types/auth";
import Link from "next/link";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";

export default function ReviewPage() {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: string;
  };
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !isReviewer(session.user?.role)) {
      router.push("/blog?unauthorized=1");
      return;
    }
  }, [session, status, router]);

  // Handle modal state changes
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [isModalOpen]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#ffffff]">Loading...</div>
      </div>
    );
  }

  if (!session || !isReviewer(session.user?.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {/* Header */}{" "}
        <div className="flex justify-between items-center mb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#ffffff]">
              Post Review Dashboard
            </h1>
            <p className="mt-2 text-[#fffff2]">
              Review and approve posts from content creators before they go
              live.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        {/* Review Interface */}
        <div className="space-y-6">
          <PendingPostsList onModalStateChange={setIsModalOpen} />
        </div>
      </div>
    </div>
  );
}
