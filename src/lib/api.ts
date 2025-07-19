import { Post, PortfolioItem, Product } from "./definitions";

/**
 * @file src/lib/api.ts
 * @description این فایل شامل تمام توابع مربوط به دریافت داده از Strapi API است.
 * مرکزی کردن توابع fetch در این فایل، خوانایی و نگهداری کد را بهبود می‌بخشد.
 */

// آدرس پایه API از متغیرهای محیطی خوانده می‌شود تا قابل تغییر باشد
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

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

/**
 * Searches for posts in Strapi based on a query string.
 * @param {string} query The user's search term.
 * @returns {Promise<Post[]>} An array of posts matching the query.
 */

export async function searchContent(query: string): Promise<Post[]> {
  if (!query) return [];

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // The filter now uses the correct syntax for Strapi v4
  const res = await fetch(
    `${STRAPI_URL}/api/posts?filters[title][$containsi]=${query}&populate=*`
  );

  if (!res.ok) {
    console.error("Failed to fetch search results");
    return [];
  }

  const responseJson = await res.json();
  // Return the full data array, which includes 'id' and 'attributes'
  return responseJson.data;
}

/**
 * Fetches all published posts from Strapi.
 * @returns {Promise<Post[]>} An array of posts.
 */

export async function getPosts(): Promise<Post[]> {
  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  const res = await fetch(`${STRAPI_URL}/api/posts?populate=*`);

  if (!res.ok) {
    console.error("Failed to fetch posts");
    return [];
  }

  const responseJson = await res.json();
  // Return the data directly, assuming it's flattened
  return responseJson.data || responseJson;
}


/**
 * Fetches a single post from Strapi by its slug.
 * @param {string} slug The slug of the post to fetch.
 * @returns {Promise<Post | null>} The post object or null if not found.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  const res = await fetch(`${STRAPI_URL}/api/posts?filters[slug][$eq]=${slug}&populate=*`);
  
  if (!res.ok) {
    console.error("Failed to fetch post");
    return null;
  }

  const responseJson = await res.json();
  if (!responseJson.data || responseJson.data.length === 0) {
    return null;
  }
  
  // Return the first item from the data array (assuming it's flattened by a plugin)
  return responseJson.data[0];
}