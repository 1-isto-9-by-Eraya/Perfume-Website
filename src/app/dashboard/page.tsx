// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isReviewer } from "@/lib/roles";
import UploaderDashboard from "@/components/dashboard/UploaderDashboard";
import ReviewerDashboard from "@/components/dashboard/ReviewerDashboard";
import type { ExtendedSession } from "@/types/auth";
import { UnauthorizedPopup } from "@/components/UnauthorisedPopup";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Dashboard({
  searchParams,
}: {
  // Next 15: searchParams is a Promise
  searchParams?: Promise<SearchParams>;
}) {
  // Resolve and normalize ?unauthorized
  const sp = (await searchParams) ?? {};
  const unauthorizedParam = Array.isArray(sp.unauthorized) ? sp.unauthorized[0] : sp.unauthorized;
  const unauthorized = unauthorizedParam === "1";

  // If middleware flagged unauthorized, show the popup
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
          <h1 className="text-3xl font-bold text-[#ffffff]">Welcome back, {userName}!</h1>
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
