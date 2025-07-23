"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

// Defines the structure of a comment object fetched from the API
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
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  /**
   * Fetches the list of comments for the current blog post.
   */
  const fetchComments = async () => {
    try {
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
  };

  // Fetch comments when the component first loads
  useEffect(() => {
    fetchComments();
  }, [postId]);

  /**
   * Handles the submission of a new comment.
   * Sends an authenticated request to the Strapi API.
   */
  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          // We use 'postId' for blog posts
          postId: postId,
          contentType: "api::post.post",
        }),
      });

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
      <h2 className="text-3xl font-bold text-center mb-8">
        دیدگاهتان را بنویسید
      </h2>

      {/* Show the form only if the user is logged in */}
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

      {/* Display the list of comments or a loading/empty message */}
      <div className="space-y-6">
        {isLoading ? (
          <p className="text-center text-gray-400">
            در حال بارگذاری دیدگاه‌ها...
          </p>
        ) : comments.length > 0 ? (
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
        ) : (
          <p className="text-center text-gray-500">
            هنوز دیدگاهی ثبت نشده است. اولین نفر باشید!
          </p>
        )}
      </div>
    </section>
  );
}
