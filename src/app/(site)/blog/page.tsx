import { getPosts } from "@/lib/api";
import Link from "next/link";
import Image from 'next/image';
import type { Post } from "@/lib/definitions";

export default async function BlogPage() {
  const posts = await getPosts();
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">وبلاگ</h1>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: Post) => {
            // Your corrected logic, which is perfect for a flattened response
            const imageUrl = post.coverImage?.url
              ? `${STRAPI_URL}${post.coverImage.url}`
              : "https://placehold.co/1600x900/1f2937/f97616?text=No+Image";

            return (
              <Link 
                href={`/blog/${post.slug || post.id}`} 
                key={post.id}
                className="block group"
              >
                <div className="flex flex-col h-full rounded-lg overflow-hidden shadow-lg bg-gray-800 transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-gray-100">{post.title}</h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400">هیچ پستی برای نمایش وجود ندارد.</p>
      )}
    </div>
  );
}