"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // This is the core NextAuth function to handle login
    const result = await signIn('credentials', {
      redirect: false, // We handle redirect manually
      identifier: email,
      password: password,
    });

    if (result?.error) {
      setError("ایمیل یا رمز عبور نامعتبر است.");
    } else if (result?.ok) {
      // On success, redirect to the homepage or a dashboard
      router.push("/");
    }
  };
  
  const inputStyles = "w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400";

  return (
    <div className="container mx-auto px-6 py-24 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">ورود به حساب کاربری</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="ایمیل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputStyles}
          />
          <input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputStyles}
          />

          {error && <p className="text-red-400 text-center">{error}</p>}
          
          <Button type="submit" variant="primary" size="lg" className="w-full">
            ورود
          </Button>

          <p className="text-center text-gray-400">
            حساب کاربری ندارید؟{" "}
            <Link href="/register" className="text-orange-400 hover:underline">
              ثبت نام کنید
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}