import { getPortfolioItemBySlug, getPortfolioItems } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Remarkable } from "remarkable";
import type { DescriptionBlock } from "@/lib/definitions";
import Gallery from "@/components/portfolio/Gallery";
import Link from "next/link";

// A reusable component for skill badges
function SkillBadge({ skill }: { skill: string }) {
  return (
    <span className="bg-gray-700 text-gray-300 text-sm font-medium me-2 px-3 py-1 rounded-full">
      {skill}
    </span>
  );
}

// Helper function to convert Strapi's Rich Text JSON to a string
function richTextToString(description: DescriptionBlock[] | null): string {
  if (!description) return "";
  return description
    .map((block) => block.children.map((child) => child.text).join(""))
    .join("\n\n"); // Join paragraphs with double newlines
}

// Helper function to render the features table
function FeaturesTable({
  features,
}: {
  features: { [key: string]: string } | null;
}) {
  if (!features) return null;
  const entries = Object.entries(features);
  if (entries.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-white mb-4">ویژگی‌های پروژه</h2>
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        {entries.map(([key, value], index) => (
          <div
            key={key}
            className={`flex justify-between p-4 ${
              index < entries.length - 1 ? "border-b border-gray-700" : ""
            }`}
          >
            <dt className="text-gray-400">{key}</dt>
            <dd className="font-semibold text-white">{value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function PortfolioItemPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);

  if (!item) {
    notFound();
  }

  // --- Logic for Next/Previous Project ---
  const allItems = await getPortfolioItems();
  const currentIndex = allItems.findIndex((p) => p.id === item.id);
  const prevItem = allItems[currentIndex - 1];
  const nextItem = allItems[currentIndex + 1];
  // ---

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  const imageUrl = item.coverImage?.url
    ? `${STRAPI_URL}${item.coverImage.url}`
    : "https://placehold.co/1200x600/1f2937/f97616?text=Project+Image";

  const descriptionString = richTextToString(item.description);
  const md = new Remarkable();
  const htmlDescription = descriptionString ? md.render(descriptionString) : "";

  const galleryImages = item.gallery;

  return (
    <div className="container mx-auto px-6 py-12">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white">{item.title}</h1>
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {item.technologies.split(",").map((tech) => (
              <SkillBadge key={tech.trim()} skill={tech.trim()} />
            ))}
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-12 shadow-lg">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Project Description & Gallery */}
        <div className="prose prose-invert lg:prose-xl max-w-none text-right leading-loose">
          {htmlDescription && (
            <div dangerouslySetInnerHTML={{ __html: htmlDescription }} />
          )}

          <FeaturesTable features={item.features} />

          {galleryImages && galleryImages.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                گالری تصاویر
              </h2>
              <Gallery images={galleryImages} />
            </div>
          )}
        </div>

        {/* Live Site Button */}
        {item.liveUrl && (
          <div className="text-center mt-12">
            <Button href={item.liveUrl} variant="primary" size="lg">
              مشاهده وب‌سایت پروژه
            </Button>
          </div>
        )}
        
      </article>
      <nav className="flex justify-between items-center mt-24 border-t border-gray-700 pt-8">
        <div>
          {prevItem && (
            <Link
              href={`/portfolio/${prevItem.slug || prevItem.id}`}
              className="flex items-center gap-x-2 text-gray-400 hover:text-orange-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>پروژه قبلی</span>
            </Link>
          )}
        </div>
        <div>
          {nextItem && (
            <Link
              href={`/portfolio/${nextItem.slug || nextItem.id}`}
              className="flex items-center gap-x-2 text-gray-400 hover:text-orange-400 transition-colors"
            >
              <span>پروژه بعدی</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
