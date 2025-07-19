import { PortfolioItem, Product } from "./definitions";

/**
 * @file src/lib/api.ts
 * @description این فایل شامل تمام توابع مربوط به دریافت داده از Strapi API است.
 * مرکزی کردن توابع fetch در این فایل، خوانایی و نگهداری کد را بهبود می‌بخشد.
 */

// آدرس پایه API از متغیرهای محیطی خوانده می‌شود تا قابل تغییر باشد
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * دریافت لیست آیتم‌های نمونه کار از Strapi
 * @returns {Promise<PortfolioItem[]>} آرایه‌ای از آیتم‌های نمونه کار
 */
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const res = await fetch(`${STRAPI_URL}/api/portfolios?populate=*`);
  if (!res.ok) throw new Error("Failed to fetch portfolio items");
  
  const responseJson = await res.json();
  
  // این کد هر دو حالت پاسخ استاندارد و پاسخ "flattened" را مدیریت می‌کند
  return responseJson.data || responseJson;
}

/**
 * دریافت لیست محصولات از Strapi
 * @returns {Promise<Product[]>} آرایه‌ای از محصولات
 */
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${STRAPI_URL}/api/products?populate=*`);
  if (!res.ok) throw new Error("Failed to fetch products");

  const responseJson = await res.json();

  // محصولات از ساختار استاندارد Strapi با کلید 'data' استفاده می‌کنند
  return responseJson.data;
}

// Define a simple type for a Post
interface Post {
  id: number;
  title: string;
  slug: string;
}

/**
 * Searches for content in Strapi based on a query string.
 * Currently searches in Posts.
 * @param {string} query The user's search term.
 * @returns {Promise<Post[]>} An array of posts matching the query.
 */
export async function searchContent(query: string): Promise<Post[]> {
  if (!query) return [];

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  
  // Strapi's filter for case-insensitive "contains" search on the 'title' field
  const res = await fetch(`${STRAPI_URL}/api/posts?filters[title][$containsi]=${query}`);

  if (!res.ok) {
    console.error("Failed to fetch search results");
    return [];
  }

  const responseJson = await res.json();
  // We need to map over the results to return a clean array
  return responseJson.data.map((item: null) => item.attributes);
}