import { getPosts } from "@/lib/api";
import { Remarkable } from "remarkable";
import Image from "next/image";
import type { Post } from "@/lib/definitions";

/**
 * این تابع فقط یک پست را بر اساس slug آن از میان تمام پست‌ها پیدا می‌کند.
 * در یک پروژه واقعی، بهتر است یک اندپوینت جدا در API برای این کار داشته باشید.
 */
async function getSinglePost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  const post = posts.find((p) => p.attributes.slug === slug);
  return post || null;
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getSinglePost(params.slug);
  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  if (!post) {
    return (
      <div className="container mx-auto py-12 text-center">
        پست مورد نظر یافت نشد.
      </div>
    );
  }

  const imageUrl = post.attributes.coverImage?.data?.attributes?.url
    ? `${STRAPI_URL}${post.attributes.coverImage.data.attributes.url}`
    : null;

  // تبدیل محتوای Markdown به HTML برای نمایش
  const md = new Remarkable();
  const htmlContent = post.attributes.content
    ? md.render(post.attributes.content)
    : "";

  return (
    <div className="container mx-auto px-6 py-12">
      <article className="max-w-4xl mx-auto">
        {imageUrl && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
            <Image
              src={imageUrl}
              alt={post.attributes.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h1 className="text-4xl font-extrabold mb-4 text-white">
          {post.attributes.title}
        </h1>
        <p className="text-gray-400 mb-8">
          منتشر شده در:{" "}
          {new Date(post.attributes.createdAt).toLocaleDateString("fa-IR")}
        </p>
        {/* محتوای مقاله که از Markdown به HTML تبدیل شده در اینجا رندر می‌شود.
              کلاس prose استایل‌های پیش‌فرض و زیبایی به تگ‌های HTML می‌دهد.
            */}
        <div
          className="prose prose-invert lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </div>
  );
}
