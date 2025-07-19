import Image from "next/image";
import Link from "next/link";
import { PortfolioCardProps } from "@/lib/data";

/**
 * @file src/components/ui/PortfolioCard.tsx
 * @description کامپوننت قابل استفاده مجدد برای نمایش یک آیتم نمونه‌کار به صورت کارت.
 */

export default function PortfolioCard({
  imageUrl,
  title,
  technologies,
  link,
}: PortfolioCardProps) {
  return (
    // کل کارت به عنوان یک لینک عمل می‌کند
    <Link href={link} className="block group">
      {/* استفاده از Flexbox برای چیدمان عمودی (flex-col)، اطمینان از هم‌قد بودن کارت‌ها (h-full)
        و فعال‌سازی افکت هاور برای فرزندان (group)
      */}
      <div className="flex flex-col h-full rounded-lg overflow-hidden shadow-lg bg-gray-800 transition-transform duration-300 group-hover:-translate-y-2">
        {/* استفاده از ارتفاع ثابت (h-96) و object-cover برای یکسان‌سازی اندازه تصاویر در تمام کارت‌ها */}
        <Image
          src={imageUrl}
          alt={title}
          width={600}
          height={400}
          className="w-full object-cover h-96"
        />
        {/* flex-grow باعث می‌شود این بخش فضای خالی عمودی را پر کرده 
          و محتوای متنی کارت‌ها در یک ردیف تراز شوند
        */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-100">{title}</h3>
          <p className="mt-2 text-orange-400 text-sm">{technologies}</p>
        </div>
      </div>
    </Link>
  );
}
