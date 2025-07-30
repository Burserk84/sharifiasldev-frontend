import { getPostBySlug, getPosts } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Remarkable } from "remarkable";
import * as cheerio from "cheerio";
import slugify from "slugify";
import Sidebar from "@/components/blog/Sidebar";
import PostCard from "@/components/blog/PostCard";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const postData = await getPostBySlug(slug);

  if (!postData) {
    notFound();
  }
  const post = postData.attributes;

  const md = new Remarkable();
  const htmlContent = post.content ? md.render(post.content) : "";

  const $ = cheerio.load(htmlContent);
  const headings = $("h2, h3");

  const toc = headings
    .map((i, el) => {
      const text = $(el).text();
      const id = slugify(text, { lower: true, strict: true });
      $(el).attr("id", id);
      return { id, text, level: parseInt(el.name.substring(1)) };
    })
    .get();

  const finalHtmlContent = $.html();
  const allPosts = await getPosts();
  const relatedPosts = allPosts.filter((p) => p.id !== postData.id).slice(0, 3);
  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  const imageUrl = post.coverImage?.data?.attributes?.url
    ? `${STRAPI_URL}${post.coverImage.data.attributes.url}`
    : null;

  return (
    <div className="container mx-auto px-6 py-12">
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
        </main>
        <aside className="lg:col-span-4">
          <Sidebar toc={toc} />
        </aside>
      </div>
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
