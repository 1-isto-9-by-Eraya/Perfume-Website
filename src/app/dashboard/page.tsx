// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-utils";
import { isReviewer } from "@/lib/roles";
import UploaderDashboard from "@/components/dashboard/UploaderDashboard";
import ReviewerDashboard from "@/components/dashboard/ReviewerDashboard";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/signin"); // ✅ Remove BASE_PATH
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#ffffff]">
            Welcome back, {session.name}!
          </h1>
          <p className="mt-2 text-[#fffff2]">
            {isReviewer(session.role)
              ? "Manage content and review posts from other creators."
              : "Create and manage your journal posts."}
          </p>
        </div>

        {isReviewer(session.role) ? (
          <ReviewerDashboard session={{ user: session }} />
        ) : (
          <UploaderDashboard session={{ user: session }} />
        )}
      </div>
    </div>
  );
}