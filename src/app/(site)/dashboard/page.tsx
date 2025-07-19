import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">پنل کاربری</h1>
        <p className="text-lg text-gray-400 mb-8">
          {/* This will now work correctly */}
          خوش آمدید،{" "}
          <span className="font-bold text-orange-400">
            {session.user?.username}
          </span>
          !
        </p>

        <SignOutButton />
      </div>
    </div>
  );
}
