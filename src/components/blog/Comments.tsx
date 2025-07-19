"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

/**
 * @file src/components/blog/Comments.tsx
 * @description کامپوننتی برای نمایش و ثبت دیدگاه‌ها برای یک پست خاص.
 * این یک Client Component است زیرا نیاز به تعامل با کاربر و مدیریت state دارد.
 */

// تعریف ساختار داده برای یک دیدگاه
interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
}

interface CommentsProps {
  postId: number;
}

export default function Comments({ postId }: CommentsProps) {
  // دریافت اطلاعات نشست (session) کاربر برای بررسی وضعیت ورود
  const { data: session } = useSession();

  // Stateها برای مدیریت لیست دیدگاه‌ها، متن دیدگاه جدید و وضعیت بارگذاری
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  /**
   * تابعی برای دریافت لیست دیدگاه‌های مربوط به این پست از API استراپی.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchComments = useCallback(async () => {
    try {
      // پلاگین کامنت استراپی از این اندپوینت برای هر پست استفاده می‌کند
      const res = await fetch(
        `${STRAPI_URL}/api/comments/api::post.post:${postId}`
      );
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  });

  // دریافت دیدگاه‌ها در اولین رندر کامپوننت
  useEffect(() => {
    fetchComments();
  }, [fetchComments, postId]);

  /**
   * این تابع هنگام ثبت فرم دیدگاه جدید اجرا می‌شود.
   * یک درخواست POST احرازهویت‌شده به API استراپی ارسال می‌کند.
   */
  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    try {
      const res = await fetch(
        `${STRAPI_URL}/api/comments/api::post.post:${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.jwt}`,
          },
          // The only change is here. We send ONLY the content.
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Strapi responded with an error:", errorData);
        throw new Error("Failed to post comment");
      }

      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error(error);
      alert("Failed to post comment.");
    }
  };

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        دیدگاهتان را بنویسید
      </h2>

      {/* نمایش فرم ثبت دیدگاه فقط در صورتی که کاربر وارد شده باشد */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-12">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="دیدگاه شما..."
            rows={4}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          ></textarea>
          <Button type="submit" variant="primary" className="mt-4">
            ارسال دیدگاه
          </Button>
        </form>
      ) : (
        // در غیر این صورت، یک پیام برای ورود به کاربر نمایش داده می‌شود
        <div className="text-center bg-gray-800 p-6 rounded-lg">
          <p>
            برای ثبت دیدگاه، لطفاً{" "}
            <Link href="/login" className="text-orange-400 hover:underline">
              وارد شوید
            </Link>
            .
          </p>
        </div>
      )}

      {/* نمایش لیست دیدگاه‌ها یا پیام بارگذاری */}
      <div className="space-y-6">
        {isLoading ? (
          <p className="text-center text-gray-400">
            در حال بارگذاری دیدگاه‌ها...
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <p className="font-bold text-white">{comment.author.name}</p>
                <p className="text-xs text-gray-400 mr-4">
                  {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
