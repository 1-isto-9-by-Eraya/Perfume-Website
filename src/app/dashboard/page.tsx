// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isReviewer } from "@/lib/roles";
import UploaderDashboard from "@/components/dashboard/UploaderDashboard";
import ReviewerDashboard from "@/components/dashboard/ReviewerDashboard";
import type { ExtendedSession } from "@/types/auth";
import { UnauthorizedPopup } from "@/components/UnauthorisedPopup";

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: { [k: string]: string | undefined };
}) {
  // If middleware flagged unauthorized, show the popup
  const params = await searchParams;
  const unauthorized = params?.unauthorized === "1";
  if (unauthorized) return <UnauthorizedPopup />;

  const session = (await getServerSession(authOptions)) as ExtendedSession | null;

  // If no session (e.g., public viewer) but not flagged (dev race), show popup anyway
  if (!session) return <UnauthorizedPopup />;

  const userRole = session.user?.role;
  const userName = session.user?.name || "User";

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#ffffff]">
            Welcome back, {userName}!
          </h1>
          <p className="mt-2 text-[#fffff2]">
            {isReviewer(userRole)
              ? "Manage content and review posts from other creators."
              : "Create and manage your journal posts."}
          </p>
        </div>

        {isReviewer(userRole) ? (
          <ReviewerDashboard session={session} />
        ) : (
          <UploaderDashboard session={session} />
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Dashboard",
  description: "Manage your journal posts and content",
};
