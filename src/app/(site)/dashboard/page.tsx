"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SignOutButton from "@/components/auth/SignOutButton";
import UpdateProfileForm from "@/components/dashboard/UpdateProfileForm";
import ChangePasswordForm from "@/components/dashboard/ChangePasswordForm";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // This hook protects the route on the client-side.
  // If the user is not authenticated, it redirects them to the login page.
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show a loading state while the session is being verified
  if (status === "loading") {
    return (
      <div className="text-center p-24 text-gray-400">در حال بارگذاری...</div>
    );
  }

  // Render the dashboard only for authenticated users
  if (status === "authenticated") {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-right mb-12">
            <h1 className="text-4xl font-bold">پنل کاربری</h1>
            <p className="mt-2 text-lg text-gray-400">
              خوش آمدید،{" "}
              <span className="font-bold text-orange-400">
                {session.user?.username || session.user?.email}
              </span>
              !
            </p>
          </div>

          {/* The new Update Profile Form component */}
          <UpdateProfileForm />
          <ChangePasswordForm />

          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-bold mb-6 text-white">
              محصولات خریداری شده
            </h2>
            <p className="text-gray-400">
              شما هنوز هیچ محصولی خریداری نکرده‌اید.
            </p>
          </div>

          <div className="mt-8">
            <SignOutButton />
          </div>
        </div>
      </div>
    );
  }

  // Render nothing while waiting for the redirect
  return null;
}
