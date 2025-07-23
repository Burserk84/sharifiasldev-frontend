"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function UpdateProfileForm() {
  const { data: session, update } = useSession();

  // Create state for each form field
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // When the session loads, populate the form with the user's current data
  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.username || "");
      setEmail(session.user.email || "");
      // Note: You will need to add firstName and lastName to your NextAuth session to pre-fill these
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, firstName, lastName }),
    });

    if (res.ok) {
      // Trigger a session update to refresh the data
      await update({ username, email });
      setMessage("پروفایل با موفقیت به‌روزرسانی شد!");
    } else {
      setMessage("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
    }
    setIsLoading(false);
  };

  const inputStyles =
    "w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 text-right";

  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-white text-right">
        ویرایش پروفایل
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              نام
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              نام خانوادگی
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              نام کاربری
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              ایمیل
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>
        <div className="pt-2">
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </div>
      </form>
      {message && (
        <p
          className={`mt-4 text-right ${
            message.includes("موفقیت") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
