import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/auth/SignOutButton";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // First, check if the user is logged in at all.
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

          {/* Add the error message back if the JWT is missing */}
          {!session.jwt && (
            <div className="mt-4 p-4 bg-red-800/50 text-red-300 border border-red-500 rounded-md">
              <p className="font-bold">خطا در اتصال به حساب کاربری</p>
              <p className="text-sm">
                توکن احراز هویت Strapi یافت نشد. قابلیت‌هایی مانند ثبت دیدگاه
                کار نخواهند کرد. لطفاً دوباره وارد شوید.
              </p>
            </div>
          )}
        </div>


        <div className="mt-8">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
