import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/auth/SignOutButton";
// We don't need the api calls for now, let's simplify to get it working.

export default async function DashboardPage() {
  const session = await getServerSession();

  // Revert to the original, more reliable check
  if (!session) {
    redirect("/login");
  }

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
          {/* Add a message if the JWT is missing */}
          {!session.jwt && (
            <p className="mt-4 p-4 bg-red-800/50 text-red-300 border border-red-500 rounded-md">
              خطا: توکن احراز هویت Strapi یافت نشد. قابلیت‌هایی مانند ثبت دیدگاه
              کار نخواهند کرد. لطفاً دوباره وارد شوید.
            </p>
          )}
        </div>

        {/* We will add the comments list back after this is fixed */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-white">
            ویژگی‌های آینده
          </h2>
          <p className="text-gray-400">
            در آینده در این بخش می‌توانید دیدگاه‌های خود را مدیریت کنید.
          </p>
        </div>

        <div className="mt-8">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
