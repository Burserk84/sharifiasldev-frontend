import { getPostBySlug, getPosts } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Remarkable } from "remarkable";
import * as cheerio from "cheerio";
import slugify from "slugify";
import Sidebar from "@/components/blog/Sidebar";
import PostCard from "@/components/blog/PostCard";
import Comments from "@/components/blog/Comments";

/**
 * @file src/app/(site)/blog/[slug]/page.tsx
 * @description این صفحه داینامیک مسئول رندر کردن یک پست وبلاگ به صورت تکی است.
 * این یک Server Component است که داده‌های مورد نیاز خود را قبل از رندر شدن دریافت می‌کند.
 */
export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  // ۱. دریافت داده‌های پست فعلی و پست‌های مرتبط در سمت سرور
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // اگر پستی با این اسلاگ پیدا نشد، صفحه 404 نمایش داده می‌شود
  if (!post) {
    notFound();
  }

  // ۲. منطق تولید فهرست مطالب (TOC)
  const md = new Remarkable();
  const htmlContent = post.content ? md.render(post.content) : "";

  const $ = cheerio.load(htmlContent);
  const headings = $("h2, h3");

  const toc = headings
    .map((i, el) => {
      const text = $(el).text();
      const id = slugify(text, { lower: true, strict: true });
      $(el).attr("id", id); // اضافه کردن id به تگ‌های h2, h3
      return {
        id,
        text,
        level: parseInt(el.name.substring(1)),
      };
    })
    .get();

  const finalHtmlContent = $.html(); // دریافت HTML نهایی با id های اضافه شده

  // ۳. آماده‌سازی داده‌های دیگر برای نمایش
  const allPosts = await getPosts();
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);
  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  const imageUrl = post.coverImage?.url
    ? `${STRAPI_URL}${post.coverImage.url}`
    : null;

  return (
    <div className="container mx-auto px-6 py-12">
      {/* ۴. طرح‌بندی اصلی دو ستونی: محتوای اصلی و سایدبار */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <main className="lg:col-span-8">
          <article>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-white text-right">
              {post.title}
            </h1>
            <p className="text-gray-400 mb-8 text-right">
              منتشر شده در:{" "}
              {new Date(post.createdAt).toLocaleDateString("fa-IR")}
            </p>

            {imageUrl && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
                <Image
                  src={imageUrl}
                  alt={post.title}
                  fill
                  // Add this 'sizes' prop
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div
              className="prose prose-invert lg:prose-xl max-w-none text-right leading-loose"
              dangerouslySetInnerHTML={{ __html: finalHtmlContent }}
            />
          </article>
          <Comments postId={post.id} />
        </main>

        <aside className="lg:col-span-4">
          <Sidebar toc={toc} />
        </aside>
      </div>

      {/* ۵. بخش نمایش پست‌های مرتبط در انتهای صفحه */}
      <section className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-8">نوشته های دیگر</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map((relatedPost) => (
            <PostCard
              key={relatedPost.id}
              post={relatedPost}
              className="h-80"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
