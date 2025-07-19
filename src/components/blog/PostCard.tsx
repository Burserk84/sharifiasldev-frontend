import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/definitions";

/**
 * @file src/components/blog/PostCard.tsx
 * @description کامپوننت قابل استفاده مجدد برای نمایش یک پست وبلاگ به صورت کارت.
 */

interface PostCardProps {
  post: Post;
  className?: string; // برای دریافت کلاس‌های مربوط به گرید
}

export default function PostCard({ post, className = "" }: PostCardProps) {
  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // مسیر صحیح برای دسترسی به URL تصویر از ساختار استاندارد Strapi
  const imageUrl = post.attributes.coverImage?.data?.attributes?.url
    ? `${STRAPI_URL}${post.attributes.coverImage.data.attributes.url}`
    : "https://placehold.co/800x600/1f2937/f97616?text=No+Image";

  return (
    <Link
      href={`/blog/${post.attributes.slug || post.id}`}
      className={`relative block group rounded-lg overflow-hidden shadow-lg ${className}`}
    >
      <Image
        src={imageUrl}
        alt={post.attributes.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* یک لایه تیره روی تصویر برای خوانایی بهتر متن */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6 text-right w-full">
        <h2 className="text-2xl font-bold text-white leading-tight">
          {post.attributes.title}
        </h2>
      </div>
    </Link>
  );
}
