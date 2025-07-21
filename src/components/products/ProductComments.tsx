"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

// Define the shape of a comment
interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
}

interface ProductCommentsProps {
  productId: number;
}

export default function ProductComments({ productId }: ProductCommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // Function to fetch comments for this specific product
  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${STRAPI_URL}/api/comments/api::product.product:${productId}`
      );
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  // Function to handle form submission
  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    try {
      const res = await fetch(
        `${STRAPI_URL}/api/comments/api::product.product:${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.jwt}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (!res.ok) throw new Error("Failed to post comment");

      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error(error);
      alert("Failed to post comment.");
    }
  };

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">نظرات کاربران</h2>
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
