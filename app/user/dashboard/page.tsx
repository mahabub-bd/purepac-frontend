import { getUser, isAuthenticated } from "@/actions/auth";
import DashboardContent from "@/components/user/dashboard-content";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard",
};

export default async function DashboardPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/auth/login");
  }

  const user = await getUser();

  return (
    <div className="container py-10 mx-auto">
      <DashboardContent user={user} />
    </div>
  );
}
