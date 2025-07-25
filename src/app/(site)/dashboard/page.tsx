"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SignOutButton from "@/components/auth/SignOutButton";
import UserProfile from "@/components/dashboard/UserProfile";
import ChangePasswordForm from "@/components/dashboard/ChangePasswordForm";
import DashboardHeader from "@/components/dashboard/DashboardHeader"; // Import the new header

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State to manage which view is active
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="text-center p-24 text-gray-400">در حال بارگذاری...</div>
    );
  }

  if (status === "authenticated" && session) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Render the new header panel */}
          <DashboardHeader session={session} onSelectView={setActiveView} />

          {/* Conditionally render the correct component based on the active view */}
          {activeView === "profile" && <UserProfile />}
          {activeView === "password" && <ChangePasswordForm />}
          {activeView === "overview" && (
            <div className="bg-gray-800 rounded-lg p-6 mt-8">
              <h2 className="text-2xl font-bold mb-6 text-white text-right">
                محصولات خریداری شده
              </h2>
              <p className="text-gray-400 text-right">
                شما هنوز هیچ محصولی خریداری نکرده‌اید.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <SignOutButton />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
