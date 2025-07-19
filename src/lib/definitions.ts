/**
 * @file src/lib/definitions.ts
 * @description این فایل شامل تمام تعاریف TypeScript (interfaces) برای نوع‌دهی داده‌هایی است
 * که از Strapi API دریافت می‌شوند. داشتن یک منبع واحد برای typeها از بروز خطا جلوگیری کرده
 * و خوانایی کد را افزایش می‌دهد.
 */

/**
 * ساختار داده‌ی یک تصویر که از فیلد Media در Strapi می‌آید.
 */
export interface StrapiImage {
  id: number;
  url: string;
}

/**
 * ساختار یک بلاک از ویرایشگر Rich Text در Strapi.
 */
export interface DescriptionBlock {
  type: string;
  children: { type: string; text: string }[];
}

/**
 * ساختار داده‌ی یک محصول.
 * این اینترفیس از ساختار استاندارد پاسخ Strapi v4 استفاده می‌کند که تمام فیلدها
 * داخل یک آبجکت `attributes` قرار دارند.
 */
export interface Product {
  id: number;
  attributes: {
    name: string;
    description: DescriptionBlock[];
    price: number;
    productImage: StrapiImage[];
  };
}

/**
 * ساختار داده‌ی یک نمونه کار.
 * نکته: این اینترفیس یک ساختار "flattened" (مسطح) را نشان می‌دهد که در آن فیلدها
 * مستقیماً روی آبجکت اصلی قرار دارند و `attributes` وجود ندارد. این حالت معمولاً
 * نتیجه استفاده از پلاگین‌هایی مانند 'strapi-plugin-transformer' است.
 */
export interface PortfolioItem {
  id: number;
  title: string;
  slug: string | null;
  technologies: string;
  coverImage: StrapiImage | null;
}

// تعریف ساختار داده برای آیتم‌های منو و زیرمنو
export interface SubMenuItem {
  title: string;
  link: string;
  submenu?: SubMenuItem[]; // زیرمنو اختیاری است و باعث بازگشتی شدن ساختار می‌شود
}

export interface DropdownMenuProps {
  title: string;
  submenu: SubMenuItem[];
}

// تعریف ساختار پراپ‌های ورودی کامپوننت برای استفاده از TypeScript
export interface PortfolioCardProps {
  imageUrl: string;
  title: string;
  technologies: string;
  link: string;
}
// برای پست های بلاگ
export interface Post {
  id: number;
  title: string;
  slug: string | null;
  content: string; // You might want to add other fields here too
  coverImage: StrapiImage | null;
}
