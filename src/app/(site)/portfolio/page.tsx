import { getPortfolioItems } from "@/lib/api";
import PortfolioCard from "@/components/ui/PortfolioCard";
import type { PortfolioItem } from "@/lib/definitions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "نمونه کارها | SharifiaslDev",
  description:
    "مجموعه‌ای از پروژه‌های موفق توسعه وب انجام شده توسط امیرعلی شریفی اصل.",
};

export default async function PortfolioPage() {
  const portfolioItems = await getPortfolioItems();
  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-white">نمونه کارها</h1>
        <p className="mt-4 text-lg text-gray-400">
          کیفیت را در عمل ببینید. نگاهی به بخشی از پروژه‌های موفق ما بیندازید.
        </p>
        <a
          href="https://drive.google.com/file/d/1BvZTvTX9pcTPhD_lkrya65O-MWZrZ-PW/view?usp=drive_link"
          download="Amirali-Sharifi-Asl-Resume.pdf"
          // We can use the Button component's styles by importing buttonVariants
          // For simplicity, we'll just style it directly here
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 bg-transparent border border-gray-500 text-gray-200 hover:bg-gray-700 h-11 px-8 mt-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 ml-2"
          >
            <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
            <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
          </svg>
          دانلود رزومه
        </a>
      </div>

      {portfolioItems && portfolioItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioItems.map((item: PortfolioItem) => {
            const imageUrl = item.coverImage?.url
              ? `${STRAPI_URL}${item.coverImage.url}`
              : "https://placehold.co/600x400/1f2937/f97616?text=No+Image";

            return (
              <PortfolioCard
                key={item.id}
                imageUrl={imageUrl}
                title={item.title}
                technologies={item.technologies}
                link={`/portfolio/${item.slug || item.id}`}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          در حال حاضر نمونه کاری برای نمایش وجود ندارد.
        </p>
      )}
    </div>
  );
}
